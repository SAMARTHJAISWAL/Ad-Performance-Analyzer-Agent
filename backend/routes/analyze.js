const express = require('express');
const path = require('path');
const fs = require('fs');
const csvParser = require('csv-parser');

const router = express.Router();

// POST /api/analyze
router.post('/', async (req, res) => {
    const fileName = req.body.fileName;

    if (!fileName) {
        return res.status(400).send('File name is required.');
    }

    const filePath = path.join(__dirname, '../uploads', fileName);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found.');
    }

    const keywords = [];
    const highPerforming = [];
    const lowPerforming = [];

    // Read and parse the CSV file
    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
            const { keyword, clicks, CTR, ACOS, ROAS } = row;

            if (ROAS > 5 && ACOS < 30 && CTR > 0.1) {
                highPerforming.push(keyword);
            } else {
                lowPerforming.push(keyword);
            }

            keywords.push({ keyword, clicks, CTR, ACOS, ROAS });
        })
        .on('end', () => {
            res.json({
                message: 'Analysis completed.',
                totalKeywords: keywords.length,
                highPerforming,
                lowPerforming,
            });
        })
        .on('error', (err) => {
            console.error(err);
            res.status(500).send('Error processing file.');
        });
});

module.exports = router;
