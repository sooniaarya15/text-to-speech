const express = require("express");
const router = express.Router();

const {
  convertTextToSpeech,
  listVoices,
  healthCheck,
} = require("../controllers/ttsController");
const { validateTtsRequest } = require("../middleware/validateRequest");
const { asyncHandler } = require("../middleware/errorHandler");

router.post("/tts", validateTtsRequest, asyncHandler(convertTextToSpeech));
router.get("/voices", listVoices);
router.get("/health", healthCheck);

module.exports = router;