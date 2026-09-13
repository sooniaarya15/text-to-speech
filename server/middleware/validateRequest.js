const {
  isSupportedLanguage,
  isValidVoiceForLanguage,
} = require("../utils/languages");

const MAX_TEXT_LENGTH = parseInt(process.env.MAX_TEXT_LENGTH || "200", 10);

// Validates the body of POST /api/tts
function validateTtsRequest(req, res, next) {
  // Content-Type check
  if (!req.is("application/json")) {
    return res.status(400).json({
      success: false,
      error: "Content-Type must be application/json",
    });
  }

  const { text, language, voice } = req.body || {};

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: "Text must not be empty.",
    });
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return res.status(400).json({
      success: false,
      error: `Text exceeds the maximum allowed length of ${MAX_TEXT_LENGTH} characters.`,
    });
  }

  if (!language || !isSupportedLanguage(language)) {
    return res.status(400).json({
      success: false,
      error: "Language is missing or not supported.",
    });
  }

  if (!voice || !isValidVoiceForLanguage(voice, language)) {
    return res.status(400).json({
      success: false,
      error: "Voice is missing, invalid, or does not belong to the selected language.",
    });
  }

  next();
}

module.exports = { validateTtsRequest, MAX_TEXT_LENGTH };