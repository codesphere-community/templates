import { showToast, fillProgressCircle} from "./utils.js";
import { animateCircles } from "./cursor.js";


// Required variables.
let imageName = null;
let audioName = null;
let convertedImage = null;
let extractedAudio = null;
const imageSizeLimit = 5 * 1024 * 1024;
const videoSizeLimit = 100 * 1024 * 1024;


// Function to disable the download buttons.
function disableImageDownload() {
    convertedImage = null;
    document.getElementById("download-image").disabled = true;
}

function disableAudioDownload() {
    extractedAudio = null;
    document.getElementById("download-audio").disabled = true;
}


// Function to handle image conversion.
async function convertImage() {

    // Clearing the converted image data.
    convertedImage = null;

    // Geting the selected file and output type.
    const file = document.getElementById("image-file").files[0];
    const outputType = document.getElementById("image-format").value;

    // Creating the FormData object for the API.
    const formData = new FormData();
    formData.append("file", file);
    formData.append("output_type", outputType);

    // Opening the try block.
    try {
        // Creating the config.
        const config = {
            responseType: "blob",
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                const percentage = Math.round((loaded / total) * 100);
                if (loaded === total) {
                    fillProgressCircle("image", percentage);
                    showToast(`Successfully uploaded ${file.name}`, "success");
                    fillProgressCircle("image", 0);
                }
                else {
                    fillProgressCircle("image", percentage);
                }
            },
            onDownloadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                const percentage = Math.round((loaded / total) * 100);
                if (loaded === total) {
                    fillProgressCircle("image", percentage);
                }
                else {
                    fillProgressCircle("image", percentage);
                }
            }
        };

        // Getting the response by sending the FormData along with the config.
        const response = await axios.post(`//${location.host}/convert-image`, formData, config);

        // Processing the response if status is 200.
        if (response.status === 200) {

            // Saving the converted image data.
            convertedImage = response.data;
            imageName = decodeURI(response.headers.get("content-disposition").split("filename=").pop());

            // Enabling the download button after successful image conversion.
            setTimeout(() => {
                fillProgressCircle("image", 0);
                showToast("Image converted successfully.", "success");
                document.getElementById("download-image").disabled = false;
            }, 1000);
        }

        else {
            // Showing error message if image conversion fails.
            disableImageDownload();
            fillProgressCircle("image", 0);
            showToast(`Error converting image: ${response.data.detail}`, "danger");
        }
    }
    catch (error) {
        console.log(error);
        disableImageDownload();
        fillProgressCircle("image", 0);
        showToast(`An error occurred: ${error.message}`, "danger");
    }
}


// Function to download the converted image.
function downloadImage() {
    if (convertedImage) {
        const blobUrl = URL.createObjectURL(convertedImage);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = imageName;
        link.click();
        URL.revokeObjectURL(blobUrl);
    }
}


async function extractAudio() {

    // Clearing the extracted audio data.
    extractedAudio = null;

    // Getting the selected file and output type.
    const file = document.getElementById("video-file").files[0];
    const outputType = document.getElementById("audio-format").value;

    // Create FormData object to send file.
    const formData = new FormData();
    formData.append("file", file);
    formData.append("output_type", outputType);

    // Opening the try block.
    try {
        // Creating the config.
        const config = {
            responseType: "blob",
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                const percentage = Math.round((loaded / total) * 100);
                if (loaded === total) {
                    fillProgressCircle("audio", percentage);
                    showToast(`Successfully uploaded ${file.name}`, "success");
                    fillProgressCircle("audio", 0);
                }
                else {
                    fillProgressCircle("audio", percentage);
                }
            },
            onDownloadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                const percentage = Math.round((loaded / total) * 100);
                if (loaded === total) {
                    fillProgressCircle("audio", percentage);
                }
                else {
                    fillProgressCircle("audio", percentage);
                }
            }
        };

        // Getting the response by sending the FormData along with the config.
        const response = await axios.post(`//${location.host}/extract-audio`, formData, config);

        // Processing the response if status is 200.
        if (response.status === 200) {

            // Saving the extracted audio data.
            extractedAudio = response.data;
            audioName = decodeURI(response.headers.get("content-disposition").split("filename=").pop());

            // Enabling the download button after successful audio extraction.
            setTimeout(() => {
                fillProgressCircle("audio", 0);
                showToast("Audio extracted successfully.", "success");
                document.getElementById("download-audio").disabled = false;
            }, 1000);

        } else {
            // Showing error message if audio extraction fails.
            disableAudioDownload();
            fillProgressCircle("image", 0);
            showToast(`Error extracting audio: ${response.data.detail}`, "danger");
        }
    }
    catch (error) {
        console.log(error);
        disableAudioDownload();
        fillProgressCircle("image", 0);
        showToast(`An error occurred: ${error.message}`, "danger");
    }
}



// Function to download the extracted audio.
function downloadAudio() {
    if (extractedAudio) {
        const blobUrl = URL.createObjectURL(extractedAudio);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = audioName;
        link.click();
        URL.revokeObjectURL(blobUrl);
    }
}


// Function to handle image file selection change.
function handleImageSelect() {

    disableImageDownload();
    const fileInput = document.getElementById("image-file");
    
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        
        // Checking if file size exceeds the given limit.
        if (file.size > imageSizeLimit) {
            showToast(`File size exceeds ${imageSizeLimit/1024/1024} MB: ${(file.size / (1024 * 1024)).toFixed(2)} MB`, "warning");
            document.getElementById("convert-image").disabled = true;
            fileInput.value = "";
            return;
        }

        handleSelector("image");
        showToast(`Selected file: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`, "success");

    } else {
        showToast("Choose a file first.");
        document.getElementById("convert-image").disabled = true;
    }
}


// Function to handle audio file selection change.
function handleVideoSelect() {

    disableAudioDownload();
    const fileInput = document.getElementById("video-file");

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        
        // Checking if file size exceeds the given limit.
        if (file.size > videoSizeLimit) {
            showToast(`File size exceeds ${videoSizeLimit/1024/1024} MB: ${(file.size / (1024 * 1024)).toFixed(2)} MB`, "warning");
            document.getElementById("extract-audio").disabled = true;
            fileInput.value = "";
            return;
        }

        handleSelector("audio");
        showToast(`Selected file: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`, "success");

    } else {
        showToast("Choose a file first.");
        document.getElementById("extract-audio").disabled = true;
    }
}


// Function to disable and enable the convert button.
function handleSelector(type) {

    let fileSelector = document.getElementById("image-file");
    let formatSelector = document.getElementById("image-format");
    let convertButton = document.getElementById("convert-image");

    if (type == "audio") {
        disableAudioDownload();
        fileSelector = document.getElementById("video-file");
        formatSelector = document.getElementById("audio-format");
        convertButton = document.getElementById("extract-audio");
    } else {
        disableImageDownload();
    }

    // Check if formatSelector has a value selected.
    if (formatSelector.value != "default" && fileSelector.value != "") {
        // If value is selected, enable the convertButton.
        convertButton.disabled = false;
    } else {
        // If no value is selected, disable the convertButton.
        convertButton.disabled = true;
    }
}


function titleClickHandler(element) {
    const titleElement = document.getElementById(element);
    titleElement.classList.toggle("background-toggle");
}


// OnLoad setup.
document.addEventListener("DOMContentLoaded", function(){

    // Clearing out elements' values.
    document.querySelectorAll('input').forEach(element => {
        element.value = '';
    });
    document.querySelectorAll('select').forEach(element => {
        element.value = "default";
    });

    document.querySelectorAll('button').forEach(element => {
        element.disabled = true;
    });

    // Adding event listeners.
    animateCircles();
    fillProgressCircle("image", 0);
    fillProgressCircle("audio", 0);
    document.getElementById("convert-image").addEventListener("click", convertImage);
    document.getElementById("download-image").addEventListener("click", downloadImage);
    document.getElementById("extract-audio").addEventListener("click", extractAudio);
    document.getElementById("download-audio").addEventListener("click", downloadAudio);
    document.getElementById("image-file").addEventListener("change", handleImageSelect);
    document.getElementById("video-file").addEventListener("change", handleVideoSelect);
    document.getElementById("image-format").addEventListener("change", () => { handleSelector("image") });
    document.getElementById("audio-format").addEventListener("change", () => { handleSelector("audio") });
    document.getElementById("file-title").addEventListener("click", () => { titleClickHandler("file-title") });
    document.getElementById("converter-title").addEventListener("click", () => { titleClickHandler("converter-title") });
});
