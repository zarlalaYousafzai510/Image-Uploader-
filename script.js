const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");

const errorMessage = document.getElementById("errorMessage");

const previewContainer = document.getElementById("previewContainer");
const previewImage = document.getElementById("previewImage");
const fileName = document.getElementById("fileName");

const progressBar = document.getElementById("progressBar");
const uploadStatus = document.getElementById("uploadStatus");

const uploadBtn = document.getElementById("uploadBtn");
const clearBtn = document.getElementById("clearBtn");

let selectedFile = null;


// Allowed image types
const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif"
];


// -----------------------------
// Choose file
// -----------------------------

fileInput.addEventListener("change", function () {

    if (fileInput.files.length > 0) {
        handleFile(fileInput.files[0]);
    }

});


// -----------------------------
// Drag over
// -----------------------------

dropArea.addEventListener("dragover", function (event) {

    event.preventDefault();

    dropArea.classList.add("dragover");

});


// -----------------------------
// Drag leave
// -----------------------------

dropArea.addEventListener("dragleave", function () {

    dropArea.classList.remove("dragover");

});


// -----------------------------
// Drop
// -----------------------------

dropArea.addEventListener("drop", function (event) {

    event.preventDefault();

    dropArea.classList.remove("dragover");

    const files = event.dataTransfer.files;

    if (files.length > 0) {
        handleFile(files[0]);
    }

});


// -----------------------------
// Handle file
// -----------------------------

function handleFile(file) {

    errorMessage.textContent = "";
    uploadStatus.textContent = "";

    // Check file type
    if (!allowedTypes.includes(file.type)) {

        errorMessage.textContent =
            "Invalid file. Only JPG, PNG and GIF images are allowed.";

        selectedFile = null;

        previewContainer.style.display = "none";

        return;
    }


    // Save selected file
    selectedFile = file;


    // Show file name
    fileName.textContent = file.name;


    // Create FileReader
    const reader = new FileReader();


    reader.onload = function (event) {

        previewImage.src = event.target.result;

        previewContainer.style.display = "block";

    };


    // Read image
    reader.readAsDataURL(file);

}


// -----------------------------
// Upload button
// -----------------------------

uploadBtn.addEventListener("click", function () {

    if (!selectedFile) {

        errorMessage.textContent =
            "Please select an image first.";

        return;
    }


    errorMessage.textContent = "";

    uploadStatus.textContent = "Uploading...";

    progressBar.style.width = "0%";
    progressBar.textContent = "0%";


    let progress = 0;


    const interval = setInterval(function () {

        progress += 10;

        progressBar.style.width = progress + "%";
        progressBar.textContent = progress + "%";


        if (progress >= 100) {

            clearInterval(interval);

            uploadStatus.textContent =
                "Upload complete!";

            saveImage();

        }

    }, 300);

});


// -----------------------------
// Save image to localStorage
// -----------------------------

function saveImage() {

    const reader = new FileReader();


    reader.onload = function (event) {

        localStorage.setItem(
            "uploadedImage",
            event.target.result
        );

        localStorage.setItem(
            "uploadedImageName",
            selectedFile.name
        );

    };


    reader.readAsDataURL(selectedFile);

}


// -----------------------------
// Load saved image
// -----------------------------

window.addEventListener("load", function () {

    const savedImage =
        localStorage.getItem("uploadedImage");

    const savedName =
        localStorage.getItem("uploadedImageName");


    if (savedImage) {

        previewImage.src = savedImage;

        previewContainer.style.display = "block";

        fileName.textContent =
            savedName || "Saved image";

        uploadStatus.textContent =
            "Saved image loaded from localStorage.";

    }

});


// -----------------------------
// Clear saved image
// -----------------------------

clearBtn.addEventListener("click", function () {

    localStorage.removeItem("uploadedImage");
    localStorage.removeItem("uploadedImageName");

    previewImage.src = "";

    previewContainer.style.display = "none";

    fileName.textContent = "";

    uploadStatus.textContent =
        "Saved image removed.";

    progressBar.style.width = "0%";
    progressBar.textContent = "0%";

});
