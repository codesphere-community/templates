import {showToast} from "./toast.js";
import { animateCircles } from "./cursor.js";


// Required variables.
animateCircles();
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

    // Clear the converted image data.
    convertedImage = null;

    // Get the selected file and output type.
    const file = document.getElementById("image-file").files[0];
    const outputType = document.getElementById("image-format").value;

    // Create FormData object to send file.
    const formData = new FormData();
    formData.append("file", file);
    formData.append("output_type", outputType);

    try {
        // Make POST request to convert image.
        const response = await fetch(`//${location.host}/convert-image`, {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            // Save the converted image data
            convertedImage = await response.blob();
            imageName = response.headers.get("content-language");

            // Enabling the download button after successful image conversion.
            document.getElementById("download-image").disabled = false;
            showToast("Image converted successfully!", "success");

        } else {
            // Image conversion failed, showing error message.
            disableImageDownload();
            const errorData = await response.json();
            showToast(`Error converting image: ${errorData.detail}`, "danger");
        }
    } catch (error) {
        // Error occurred during request.
        disableImageDownload();
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


// Function to handle audio extraction.
async function extractAudio() {

    // Clear the extracted audio data.
    extractedAudio = null;

    // Get the selected file and output type.
    const file = document.getElementById("video-file").files[0];
    const outputType = document.getElementById("audio-format").value;

    // Create FormData object to send file.
    const formData = new FormData();
    formData.append("file", file);
    formData.append("output_type", outputType);

    try {
        const response = await fetch(`//${location.host}/extract-audio`, {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            // Saving the extracted audio data.
            extractedAudio = await response.blob();
            audioName = response.headers.get("content-language");

            // Enabling the download button after successful audio extraction.
            document.getElementById("download-audio").disabled = false;
            showToast("Audio extracted successfully.", "success");

       } else {
            // Audio extraction failed, showing error message.
            disableAudioDownload();
            const errorData = await response.json();
            showToast(`Error extracting audio: ${errorData.detail}`, "danger");
       }
    } catch (error) {
        disableAudioDownload();
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
