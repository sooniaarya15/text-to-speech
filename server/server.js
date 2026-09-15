require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const ttsRoutes = require("./routes/ttsRoutes");
const { errorHandler } = require("./middleware/errorHandler");
const { cleanupOldAudio, AUDIO_DIR } = require("./services/ttsService");

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// --- Security & parsing middleware ---
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: "1mb" }));

// --- Rate limiting (protects the free TTS provider from abuse) ---
const ttsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests. Please slow down and try again shortly.",
  },
});
app.use("/api/tts", ttsLimiter);

// --- Static audio files ---
app.use("/audio", express.static(AUDIO_DIR));

// --- API routes ---
app.use("/api", ttsRoutes);

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Resource not found." });
});

// --- Centralized error handler (must be last) ---
app.use(errorHandler);

// Clean up generated audio files older than 30 minutes, every 10 minutes
setInterval(() => cleanupOldAudio(30 * 60 * 1000), 10 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`TTS server running at http://localhost:${PORT}`);
});