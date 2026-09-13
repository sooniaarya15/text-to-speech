// utils/languages.js
//
// NOTE ON PROVIDER: This starter project uses the free Google Translate
// TTS endpoint (via the `google-tts-api` package) so you can run the whole
// app WITHOUT signing up for a paid API key. That provider only offers a
// single synthetic voice per language (no separate male/female options).
//
// The code is structured so you can swap in a real provider later
// (Google Cloud TTS, Azure Speech, Amazon Polly, ElevenLabs) by editing
// ONLY server/services/ttsService.js. Everything else (routes, controller,
// validation, frontend) stays the same. Multiple voices per language will
// "just work" once you plug in a provider that supports them.

const LANGUAGES = [
  { code: "en-US", name: "English (US)" },
  { code: "en-GB", name: "English (UK)" },
  { code: "hi-IN", name: "Hindi" },
  { code: "gu-IN", name: "Gujarati" },
  { code: "mr-IN", name: "Marathi" },
  { code: "es-ES", name: "Spanish" },
  { code: "fr-FR", name: "French" },
  { code: "de-DE", name: "German" },
];

// Maps our language codes to the codes google-tts-api expects
const GOOGLE_TTS_LANG_MAP = {
  "en-US": "en",
  "en-GB": "en-GB",
  "hi-IN": "hi",
  "gu-IN": "gu",
  "mr-IN": "mr",
  "es-ES": "es",
  "fr-FR": "fr",
  "de-DE": "de",
};

// Voices are derived from languages. With the free provider there is
// exactly one voice per language, but we still expose a "voices" array
// shaped like the API contract in the project spec so a real provider
// can later return several voices per language without breaking the
// frontend.
function getVoices() {
  return LANGUAGES.map((lang, idx) => ({
    id: `voice-${idx + 1}`,
    name: `${lang.name} Standard Voice`,
    language: lang.code,
    gender: "N/A (single-voice provider)",
  }));
}

function isSupportedLanguage(code) {
  return LANGUAGES.some((l) => l.code === code);
}

function isValidVoiceForLanguage(voiceId, languageCode) {
  const voices = getVoices();
  const voice = voices.find((v) => v.id === voiceId);
  if (!voice) return false;
  return voice.language === languageCode;
}

function toGoogleLangCode(languageCode) {
  return GOOGLE_TTS_LANG_MAP[languageCode] || null;
}

module.exports = {
  LANGUAGES,
  getVoices,
  isSupportedLanguage,
  isValidVoiceForLanguage,
  toGoogleLangCode,
};