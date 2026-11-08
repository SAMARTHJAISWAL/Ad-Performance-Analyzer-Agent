const express = require('express');
const { ensureUploadDir, resolveUpload } = require('../lib/uploads');

const router = express.Router();

// POST /api/upload  (multipart/form-data, field "file")
router.post('/', (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send('No file uploaded.');
  }

  const file = req.files.file;
  const uploadPath = resolveUpload(file.name);
  if (!uploadPath) {
    return res.status(400).send('Only .csv files are allowed.');
  }

  ensureUploadDir();
  file.mv(uploadPath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to upload file.');
    }
    res.send(`File uploaded successfully: ${file.name}`);
  });
});

module.exports = router;
