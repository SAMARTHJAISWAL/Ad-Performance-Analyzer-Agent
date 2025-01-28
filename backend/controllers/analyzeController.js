const fs = require('fs');
const csvParser = require('csv-parser');
const { analyzeAdPerformance } = require('../utils/analyze');

exports.analyzeFile = (req, res) => {
    const filePath = req.body.filePath;

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found.' });
    }

    const keywordsData = [];
    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
            keywordsData.push(row);
        })
        .on('end', async () => {
            const analysis = await analyzeAdPerformance(keywordsData);
            res.status(200).json({ analysis });
        });
};
