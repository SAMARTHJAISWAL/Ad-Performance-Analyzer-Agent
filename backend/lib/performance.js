// Pure keyword-performance logic: no I/O, so it can be unit tested.

// Column names accepted for the keyword itself, in priority order (compared case-insensitively).
const KEYWORD_COLUMNS = ['keyword', 'matched product', 'search term', 'targeting'];

const DEFAULT_THRESHOLDS = Object.freeze({
  minROAS: 5, // ROAS must be greater than this
  maxACOS: 30, // ACOS (%) must be less than this
  minCTR: 0.1, // CTR must be greater than this
});

/** Lower-case, trimmed, quote-stripped header -> value map. */
function normalizeRow(row) {
  const out = {};
  for (const [key, value] of Object.entries(row)) {
    const cleanKey = key.replace(/^[\s"'﻿]+|[\s"']+$/g, '').toLowerCase();
    out[cleanKey] = typeof value === 'string' ? value.trim() : value;
  }
  return out;
}

/** Parse "12.5", "12.5%", "$1,200" into a number; NaN when not numeric. */
function toNumber(value) {
  if (typeof value === 'number') return value;
  if (value == null) return NaN;
  const cleaned = String(value).replace(/[%$,\s]/g, '');
  return cleaned === '' ? NaN : Number(cleaned);
}

function pickKeyword(row) {
  for (const column of KEYWORD_COLUMNS) {
    if (row[column]) return row[column];
  }
  return undefined;
}

function isHighPerforming({ ROAS, ACOS, CTR }, thresholds = DEFAULT_THRESHOLDS) {
  return ROAS > thresholds.minROAS && ACOS < thresholds.maxACOS && CTR > thresholds.minCTR;
}

/**
 * Classify raw CSV rows into high- and low-performing keywords.
 * Rows without a keyword or with non-numeric clicks/CTR/ACOS/ROAS are counted as skipped.
 */
function classifyRows(rows, thresholds = DEFAULT_THRESHOLDS) {
  const keywords = [];
  const highPerforming = [];
  const lowPerforming = [];
  let skipped = 0;

  for (const raw of rows) {
    const row = normalizeRow(raw);
    const keyword = pickKeyword(row);
    const metrics = {
      clicks: toNumber(row.clicks),
      CTR: toNumber(row.ctr),
      ACOS: toNumber(row.acos),
      ROAS: toNumber(row.roas),
    };

    if (!keyword || Object.values(metrics).some(Number.isNaN)) {
      skipped += 1;
      continue;
    }

    keywords.push({ keyword, ...metrics });
    (isHighPerforming(metrics, thresholds) ? highPerforming : lowPerforming).push(keyword);
  }

  return { keywords, highPerforming, lowPerforming, skipped };
}

module.exports = {
  DEFAULT_THRESHOLDS,
  KEYWORD_COLUMNS,
  classifyRows,
  isHighPerforming,
  normalizeRow,
  toNumber,
};
