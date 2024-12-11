const multer = require("multer");
const path = require("path");

// Set up Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Directory where files will be uploaded
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Create a unique filename with the original extension
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Set up Multer upload limits and file filtering (optional but recommended)
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max file size: 10MB
  fileFilter: (req, file, cb) => {
    // Only accept CSV files
    if (file.mimetype !== "text/csv") {
      return cb(new Error("Only CSV files are allowed!"), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
