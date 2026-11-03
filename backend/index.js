require('dotenv').config();
const cors = require('cors');
const express = require('express');
const fileUpload = require('express-fileupload');
const { ensureUploadDir } = require('./lib/uploads');

const app = express();
const PORT = process.env.PORT || 5005;
const MAX_UPLOAD_MB = Number(process.env.MAX_UPLOAD_MB || 10);

// CORS_ORIGIN can be a comma-separated list; unset allows any origin (local development).
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : true;
app.use(cors({ origin: corsOrigin }));

app.use(
  fileUpload({
    limits: { fileSize: MAX_UPLOAD_MB * 1024 * 1024 },
    abortOnLimit: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/upload', require('./routes/upload'));
app.use('/api/analyze', require('./routes/analyze'));

app.get('/', (req, res) => {
  res.send('Ad Performance Analyzer API is running');
});

if (require.main === module) {
  ensureUploadDir();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
    if (!process.env.GEMINI_API_KEY) {
      console.log('GEMINI_API_KEY not set: /api/analyze returns rule-based results without an LLM summary.');
    }
  });
}

module.exports = app;
