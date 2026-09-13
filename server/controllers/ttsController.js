const { generateSpeech } = require("../services/ttsService");
const { getVoices } = require("../utils/languages");
const { LANGUAGES } = require("../utils/languages");

// POST /api/tts
async function convertTextToSpeech(req, res) {
  const { text, language, voice } = req.body;

  const { audioUrl } = await generateSpeech(text.trim(), language, voice);

  res.status(200).json({
    success: true,
    audioUrl,
  });
}

// GET /api/voices
function listVoices(req, res) {
  res.status(200).json({
    languages: LANGUAGES,
    voices: getVoices(),
  });
}

// GET /api/health
function healthCheck(req, res) {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
}

module.exports = { convertTextToSpeech, listVoices, healthCheck };