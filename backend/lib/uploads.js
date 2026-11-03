const fs = require('fs');
const path = require('path');

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads'));

/** Reduce a client-supplied name to a safe base name ending in .csv, or null. */
function safeCsvName(name) {
  if (typeof name !== 'string') return null;
  const base = path.basename(name.replace(/\\/g, '/')).trim();
  if (!base || base.startsWith('.') || path.extname(base).toLowerCase() !== '.csv') return null;
  return base;
}

/** Absolute path inside UPLOAD_DIR for a client-supplied name, or null if invalid. */
function resolveUpload(name) {
  const base = safeCsvName(name);
  return base ? path.join(UPLOAD_DIR, base) : null;
}

function ensureUploadDir() {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

module.exports = { UPLOAD_DIR, ensureUploadDir, resolveUpload, safeCsvName };
