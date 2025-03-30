const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Ensure uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Keeping original filename (potential vulnerability)
    },
});

// File Filter (Allow all file types - Vulnerability!)
const fileFilter = (req, file, cb) => {
    cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter,
});

// Serve Upload Form
app.get("/", (req, res) => {
    res.send(`
        <h2>Upload a File</h2>
        <form action="/upload" method="POST" enctype="multipart/form-data">
            <input type="file" name="file" required />
            <button type="submit">Upload</button>
        </form>
    `);
});

// Handle File Upload
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("File upload failed!");
    }
    res.redirect(`/uploads/${req.file.filename}`); // Redirect to uploaded file (Vulnerability!)
});

// Serve Uploaded Files
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
    console.log(`Vulnerable server running at http://localhost:${PORT}`);
});
