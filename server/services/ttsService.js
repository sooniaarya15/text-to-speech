const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fetch = require("node-fetch");
const googleTTS = require("google-tts-api");
const { toGoogleLangCode, toTranslateLangCode } = require("../utils/languages");
const { translateText } = require("./translateService");

const AUDIO_DIR = path.join(__dirname, "..", "audio");

if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

async function generateSpeech(text, language, voice) {
  const googleLang = toGoogleLangCode(language);

  if (!googleLang) {
    const err = new Error("Unsupported language for the current TTS provider.");
    err.statusCode = 400;
    throw err;
  }

  const targetTranslateLang = toTranslateLangCode(googleLang);

  // Step 1: translate the input text into the selected language.
  let spokenText = text;
  try {
    const { translatedText } = await translateText(text, targetTranslateLang);
    if (translatedText && translatedText.trim().length > 0) {
      spokenText = translatedText;
    }
  } catch (translateError) {
    console.warn("[translate] falling back to original text:", translateError.message);
  }

  // Step 2: synthesize speech from the (translated) text.
  let base64Audio;
  try {
    base64Audio = await googleTTS.getAudioBase64(spokenText, {
      lang: googleLang,
      slow: false,
      host: "https://translate.google.com",
    });
  } catch (providerError) {
    const err = new Error("Failed to reach the Text-to-Speech provider.");
    err.statusCode = 503;
    throw err;
  }

  const filename = `speech-${uuidv4()}.mp3`;
  const filePath = path.join(AUDIO_DIR, filename);

  try {
    fs.writeFileSync(filePath, Buffer.from(base64Audio, "base64"));
  } catch (fsError) {
    const err = new Error("Failed to save generated audio file.");
    err.statusCode = 500;
    throw err;
  }

  return {
    filename,
    audioUrl: `/audio/${filename}`,
    spokenText,
  };
}

function cleanupOldAudio(maxAgeMs = 30 * 60 * 1000) {
  fs.readdir(AUDIO_DIR, (err, files) => {
    if (err) return;
    const now = Date.now();
    files.forEach((file) => {
      const filePath = path.join(AUDIO_DIR, file);
      fs.stat(filePath, (statErr, stats) => {
        if (statErr) return;
        if (now - stats.mtimeMs > maxAgeMs) {
          fs.unlink(filePath, () => {});
        }
      });
    });
  });
}

module.exports = { generateSpeech, cleanupOldAudio, AUDIO_DIR };