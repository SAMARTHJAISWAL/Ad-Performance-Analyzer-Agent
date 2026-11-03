const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');
const { classifyRows } = require('../lib/performance');
const { summarize } = require('../lib/summary');
const { resolveUpload } = require('../lib/uploads');

const router = express.Router();

function readCsv(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .on('error', reject)
      .pipe(csvParser())
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}

// POST /api/analyze  { "fileName": "ads.csv" }
router.post('/', async (req, res) => {
  const filePath = resolveUpload(req.body && req.body.fileName);
  if (!filePath) {
    return res.status(400).json({ error: 'A valid .csv fileName is required.' });
  }
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found. Upload it first.' });
  }

  let rows;
  try {
    rows = await readCsv(filePath);
  } catch (err) {
    console.error('Error reading CSV:', err);
    return res.status(500).json({ error: 'Error processing file.' });
  }

  const analysis = classifyRows(rows);

  let summary = null;
  let summaryError = null;
  try {
    summary = await summarize(analysis);
  } catch (err) {
    // The rule-based analysis is still useful without the LLM summary.
    console.error('Gemini summary failed:', err.message);
    summaryError = 'LLM summary unavailable.';
  }

  res.json({
    message: 'Analysis completed.',
    totalKeywords: analysis.keywords.length,
    skippedRows: analysis.skipped,
    highPerforming: analysis.highPerforming,
    lowPerforming: analysis.lowPerforming,
    keywords: analysis.keywords,
    summary,
    ...(summaryError && { summaryError }),
  });
});

module.exports = router;
