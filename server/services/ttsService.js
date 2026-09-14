const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fetch = require("node-fetch");
const googleTTS = require("google-tts-api");
const { toGoogleLangCode } = require("../utils/languages");

const AUDIO_DIR = path.join(__dirname, "..", "audio");

if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

/**
 * generateSpeech
 * Converts text into an mp3 file and returns its public URL path.
 *
 * To swap providers (Google Cloud TTS / Azure / Amazon Polly / ElevenLabs),
 * replace the body of this function. Keep the same function signature
 * (text, language, voice) => Promise<{ filename, audioUrl }> and the rest
 * of the app (controller, routes, frontend) will keep working unchanged.
 */
async function generateSpeech(text, language, voice) {
  const googleLang = toGoogleLangCode(language);

  if (!googleLang) {
    const err = new Error("Unsupported language for the current TTS provider.");
    err.statusCode = 400;
    throw err;
  }

  let base64Audio;
  try {
    // getAudioBase64 returns base64-encoded mp3 audio for up to ~200 chars
    base64Audio = await googleTTS.getAudioBase64(text, {
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
  };
}

// Optional housekeeping: delete audio files older than maxAgeMs.
// Called on an interval from server.js so the /audio folder doesn't
// grow forever during local development.
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