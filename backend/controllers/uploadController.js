const path = require('path');
const fs = require('fs');

exports.uploadFile = (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const file = req.files.file;
    const uploadPath = path.join(__dirname, '../uploads', file.name);

    file.mv(uploadPath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'File upload failed.' });
        }
        res.status(200).json({ message: 'File uploaded successfully.', filePath: uploadPath });
    });
};
