const { generateSpeech } = require("../services/ttsService");
const { getVoices } = require("../utils/languages");
const { LANGUAGES } = require("../utils/languages");

// POST /api/tts
async function convertTextToSpeech(req, res) {
  const { text, language, voice } = req.body;

  const { audioUrl, spokenText } = await generateSpeech(text.trim(), language, voice);

  res.status(200).json({
    success: true,
    audioUrl,
    spokenText,
  });
}

// GET /api/voices
function listVoices(req, res) {
  res.status(200).json({
    languages: LANGUAGES,
    voices: getVoices(),
  });
}

function healthCheck(req, res) {                                                 // GET /api/health
  res.status(200).json({ status: "ok", uptime: process.uptime() });
}

module.exports = { convertTextToSpeech, listVoices, healthCheck };