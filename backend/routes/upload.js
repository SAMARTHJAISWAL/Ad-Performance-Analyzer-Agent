const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// POST /api/upload
router.post('/', (req, res) => {
    // Check if a file was uploaded
    if (!req.files || !req.files.file) {
        return res.status(400).send('No file uploaded.');
    }

    const file = req.files.file;

    // Validate file type
    if (path.extname(file.name) !== '.csv') {
        return res.status(400).send('Only .csv files are allowed.');
    }

    // Save file to 'uploads' directory
    const uploadPath = path.join(__dirname, '../uploads', file.name);

    file.mv(uploadPath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Failed to upload file.');
        }

        res.send(`File uploaded successfully: ${file.name}`);
    });
});

module.exports = router;
