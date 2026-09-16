const translate = require("google-translate-api-x");

async function translateText(text, targetLang) {
  try {
    const result = await translate(text, { to: targetLang, client: "gtx" });
    return {
      translatedText: result.text,
      detectedSourceLang: result.from?.language?.iso || null,
    };
  } catch (err) {
    const translationError = new Error("Failed to reach the translation service.");
    translationError.statusCode = 503;
    throw translationError;
  }
}

module.exports = { translateText };