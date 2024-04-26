import os
import magic
from PIL import Image
from io import BytesIO
from moviepy.editor import VideoFileClip
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, HTMLResponse
from fastapi import FastAPI, File, Form, UploadFile, HTTPException


#-Supported formats-#
supported_audio_formats = {'mp3', 'wav', 'ogg', 'flac'}
supported_video_formats = {'mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv'}
supported_image_types = {"bmp", "gif", "ico", "jpeg", "png", "ppm", "tiff", "webp", "xbm", "xpm", "pdf"}

#-Base objects-#
app = FastAPI()
app.mount("/static", StaticFiles(directory = "Webpage"), name="static")

#-CORS configuration-#
origins = [
    "http://localhost:3000",
    "http://localhost:3000/",
]

app.add_middleware(
    CORSMiddleware,
    allow_headers = ["*"],
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["GET", "POST"],
)


def get_output_name(filename: str, output_type: str) -> str:

    filename = os.path.splitext(filename)[0]
    return f"{filename}.{output_type}"


@app.get("/")
def health_check():
    with open(os.path.join("Webpage", "index.html"), "r") as file:
        html_content = file.read()
    return HTMLResponse(content = html_content)


@app.get("/health-check")
def health_check():
    return {"Regards": "Ahmed Khatib"}


@app.post("/convert-image")
async def convert_image(file: UploadFile = File(...), output_type: str = Form(...)):

    if not file:
        raise HTTPException(status_code = 400, detail = "No file provided.")

    if not output_type:
        raise HTTPException(status_code = 400, detail = "No output type provided.")

    #-Base Objects-#
    image_data = BytesIO()    
    file_content = await file.read()
    output_file = get_output_name(file.filename, output_type)

    #-Type validation-#
    mime = magic.from_buffer(file_content, mime = True).split("/")[0]
    if mime != "image":
        raise HTTPException(status_code = 400, detail = "Given file is not an image.")

    #-Image Processing-#
    image = Image.open(BytesIO(file_content))
    image.save(image_data, format = output_type)
    image_data.seek(0)

    return Response(
        content = image_data.read(),
        media_type = f"image/{output_type}",
        headers = {"Content-Language": output_file})


@app.post("/extract-audio")
async def extract_audio(file: UploadFile = File(...), output_type: str = Form(None)):

    #-Returning error if file is not given-#
    if not file:
        raise HTTPException(status_code = 400, detail = "No file provided.")

    #-Returning error if output type is not given-#
    if not output_type:
        raise HTTPException(status_code = 400, detail = "No output type provided.")

    #-Base Objects-#
    temp_file = "test.test"
    file_content = await file.read()
    output_file = get_output_name(file.filename, output_type)

    #-Type validation-#
    mime = magic.from_buffer(file_content, mime = True).split("/")[0]
    if mime != "video":
        raise HTTPException(status_code = 400, detail = "Given file is not a video.")

    #-Writing the video file to a temp file-#
    with open(temp_file, "wb") as temp:
        temp.write(file_content)
        del file_content

    #-Creating video from the temp file and removing it-#
    video_clip = VideoFileClip(temp_file)

    #-Extracting and writing the audio-#
    audio_clip = video_clip.audio
    audio_clip.write_audiofile(output_file, codec = output_type)

    #-Closing and cleanups-#
    video_clip.close()
    audio_clip.close()
    os.remove(temp_file)
    del video_clip, audio_clip

    #-Opening the saved audio file-#
    with open(output_file, "rb") as file:
        audio_data = file.read()

    #-Removing the audio file-#
    os.remove(output_file)

    return Response(
        content = audio_data,
        media_type = f"audio/{output_type}",
        headers = {"Content-Language": output_file})
