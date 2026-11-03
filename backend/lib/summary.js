// Optional LLM summary of an analysis via the Google Gen AI SDK.
// Only runs when GEMINI_API_KEY is set; otherwise the API returns the rule-based result alone.

const DEFAULT_MODEL = 'gemini-flash-latest';

function buildPrompt({ highPerforming, lowPerforming, keywords }) {
  const rows = keywords
    .slice(0, 200)
    .map((k) => `${k.keyword}: clicks=${k.clicks}, CTR=${k.CTR}, ACOS=${k.ACOS}, ROAS=${k.ROAS}`)
    .join('\n');

  return `You are an expert in ad campaign analysis.
High-performing keywords (ROAS > 5, ACOS < 30, CTR > 0.1): ${highPerforming.join(', ') || 'None'}
Low-performing keywords: ${lowPerforming.join(', ') || 'None'}

Per-keyword metrics:
${rows}

Write a concise summary (under 150 words) of strengths, weaknesses and specific, actionable suggestions
(e.g. which keywords to pause, bid down, or scale).`;
}

async function summarize(analysis, { apiKey = process.env.GEMINI_API_KEY, model } = {}) {
  if (!apiKey) return null;
  const { GoogleGenAI } = require('@google/genai');
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: model || process.env.GEMINI_MODEL || DEFAULT_MODEL,
    contents: buildPrompt(analysis),
  });
  return response.text ? response.text.trim() : null;
}

module.exports = { DEFAULT_MODEL, buildPrompt, summarize };
