import os
import magic
from PIL import Image
from io import BytesIO
from moviepy.editor import VideoFileClip
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, HTMLResponse
from fastapi import FastAPI, File, Form, UploadFile, HTTPException


#-Base objects-#
origins = []
app = FastAPI()
supported_audio_formats = {'mp3', 'wav', 'ogg', 'flac'}
supported_video_formats = {'mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv'}
supported_image_types = {"bmp", "gif", "ico", "jpeg", "png", "ppm", "tiff", "webp", "xbm", "xpm", "pdf"}

#-Mounting the CSS and JS files-#
app.mount("/static", StaticFiles(directory = "Webpage"), name="static")

#-Adding the CORS configuration to the app-#
app.add_middleware(
    CORSMiddleware,
    allow_headers = ["*"],
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["GET", "POST"],
)


#-Function to get the output filename-#
def get_output_name(filename: str, output_type: str) -> str:
    filename = os.path.splitext(filename)[0]
    return f"{filename}.{output_type}"


#-Root endpoint to serve the frontend-#
@app.get("/")
def health_check():
    with open(os.path.join("Webpage", "index.html"), "r") as file:
        html_content = file.read()
    return HTMLResponse(content = html_content)


#-Endpoint to check if the server is up and running-#
@app.get("/health-check")
def health_check():
    return {"Regards": "Ahmed Khatib"}


#-Endpoint for image conversion-#
@app.post("/convert-image")
async def convert_image(file: UploadFile = File(...), output_type: str = Form(...)):

    #-Handling missing file-#
    if not file:
        raise HTTPException(status_code = 400, detail = "No file provided.")

    #-Handling missing output type-#
    if not output_type:
        raise HTTPException(status_code = 400, detail = "No output type provided.")

    #-Base Objects-#
    image = None
    image_data = BytesIO()    
    file_content = await file.read()
    output_file = get_output_name(file.filename, output_type)

    #-Type validation-#
    mime = magic.from_buffer(file_content, mime = True).split("/")[0]
    if mime != "image":
        raise HTTPException(status_code = 400, detail = "Given file is not an image.")

    #-Processing image in try block-#
    try:
        image = Image.open(BytesIO(file_content))
        image.save(image_data, format = output_type)
        image_data.seek(0)

    #-Raising exception if face error-#
    except:
        raise HTTPException(status_code = 400, detail = "Error converting image. Make sure it is a valid image file.")

    #-Closing files to prevent issues-#
    finally:
        if image:
            image.close()

    #-Returning the response if conversion successful-#
    return Response(
        content = image_data.read(),
        media_type = f"image/{output_type}",
        headers = {"Content-Language": output_file})


@app.post("/extract-audio")
async def extract_audio(file: UploadFile = File(...), output_type: str = Form(None)):

    #-Handling missing file-#
    if not file:
        raise HTTPException(status_code = 400, detail = "No file provided.")

    #-Handling missing output type-#
    if not output_type:
        raise HTTPException(status_code = 400, detail = "No output type provided.")

    #-Base Objects-#
    video_clip = None
    audio_clip = None
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

    #-Extracting audio in try block-#
    try:
        #-Creating video from the temp file and removing it-#
        video_clip = VideoFileClip(temp_file)

        #-Extracting and writing the audio-#
        audio_clip = video_clip.audio
        audio_clip.write_audiofile(output_file, codec = output_type)

    #-Raising exception if face error-#
    except:
        raise HTTPException(status_code = 400, detail = "Error extracting audio. Make sure it is a video file.")

    #-Closing files to prevent issues-#
    finally:
        if video_clip:
            video_clip.close()
        if audio_clip:
            audio_clip.close()
        os.remove(temp_file)
        del video_clip, audio_clip

    #-Opening the saved audio file-#
    with open(output_file, "rb") as file:
        audio_data = file.read()

    #-Removing the audio file-#
    os.remove(output_file)

    #-Returning the response if conversion successful-#
    return Response(
        content = audio_data,
        media_type = f"audio/{output_type}",
        headers = {"Content-Language": output_file})
