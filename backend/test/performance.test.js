const test = require('node:test');
const assert = require('node:assert/strict');
const { classifyRows, normalizeRow, toNumber } = require('../lib/performance');
const { safeCsvName } = require('../lib/uploads');
const { buildPrompt } = require('../lib/summary');

test('toNumber handles percents, currency and blanks', () => {
  assert.equal(toNumber('12.5%'), 12.5);
  assert.equal(toNumber('$1,200'), 1200);
  assert.ok(Number.isNaN(toNumber('')));
  assert.ok(Number.isNaN(toNumber(undefined)));
});

test('normalizeRow lower-cases and strips quotes/BOM from headers', () => {
  assert.deepEqual(normalizeRow({ '﻿"Matched product"': ' shoes ', CTR: '0.2' }), {
    'matched product': 'shoes',
    ctr: '0.2',
  });
});

test('classifyRows splits keywords by ROAS/ACOS/CTR thresholds', () => {
  const rows = [
    { keyword: 'keyword1', clicks: '100', CTR: '0.2', ACOS: '25', ROAS: '6' },
    { keyword: 'keyword2', clicks: '50', CTR: '0.15', ACOS: '35', ROAS: '4' },
    { 'Matched product': 'keyword3', Clicks: '80', CTR: '0.12', ACOS: '20', ROAS: '5.5' },
    { keyword: 'broken', clicks: 'n/a', CTR: '0.1', ACOS: '1', ROAS: '1' },
    { clicks: '1', CTR: '1', ACOS: '1', ROAS: '9' },
  ];
  const result = classifyRows(rows);
  assert.deepEqual(result.highPerforming, ['keyword1', 'keyword3']);
  assert.deepEqual(result.lowPerforming, ['keyword2']);
  assert.equal(result.keywords.length, 3);
  assert.equal(result.skipped, 2);
});

test('boundary values are not high-performing (strict comparisons)', () => {
  const { highPerforming } = classifyRows([{ keyword: 'edge', clicks: 1, CTR: 0.1, ACOS: 30, ROAS: 5 }]);
  assert.deepEqual(highPerforming, []);
});

test('safeCsvName blocks path traversal and non-csv names', () => {
  assert.equal(safeCsvName('../../etc/passwd.csv'), 'passwd.csv');
  assert.equal(safeCsvName('..\\..\\x.csv'), 'x.csv');
  assert.equal(safeCsvName('report.CSV'), 'report.CSV');
  assert.equal(safeCsvName('notes.txt'), null);
  assert.equal(safeCsvName('.csv'), null);
  assert.equal(safeCsvName(undefined), null);
});

test('buildPrompt includes both keyword groups', () => {
  const prompt = buildPrompt(classifyRows([
    { keyword: 'good', clicks: 1, CTR: 0.5, ACOS: 10, ROAS: 8 },
    { keyword: 'bad', clicks: 1, CTR: 0.01, ACOS: 90, ROAS: 1 },
  ]));
  assert.match(prompt, /High-performing keywords.*good/);
  assert.match(prompt, /Low-performing keywords: bad/);
});
