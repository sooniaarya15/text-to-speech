# Text-to-Speech Application

A full-stack web application that converts written text into natural-sounding speech. Built with **React** on the frontend and **Node.js + Express** on the backend, integrated with a Text-to-Speech provider.

Users can enter text, choose a language and voice, generate audio, play it back in the browser, and download it as an MP3 file.

---

## Features

- Text input with live character and word count
- Language selection (English, Hindi, Gujarati, Marathi, Spanish, French, German)
- Voice selection scoped to the chosen language
- Speech generation via a backend REST API
- In-browser audio playback (play, pause, seek, volume)
- Downloadable MP3 output
- Input validation and centralized error handling (empty text, oversized text, invalid language/voice, network/server failures)
- Rate limiting to prevent API abuse

---

## Tech Stack

| Layer      | Technology                                  |
|------------|----------------------------------------------|
| Frontend   | React (Vite), Axios, custom CSS               |
| Backend    | Node.js, Express.js                           |
| TTS Engine | Google Translate TTS (`google-tts-api`, free, no key required) |
| Security   | Helmet, CORS, express-rate-limit              |

The backend is intentionally structured so the TTS provider can be swapped (Google Cloud TTS, Azure Speech, Amazon Polly, ElevenLabs) by editing a single file: `server/services/ttsService.js`.

---

## Project Structure

```
text-to-speech/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # TextInput, LanguageSelector, VoiceSelector,
│   │   │                    # GenerateButton, AudioPlayer, DownloadButton, ErrorMessage
│   │   ├── services/        # api.js — Axios client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── .env.example
│
├── server/                  # Express backend
│   ├── controllers/         # ttsController.js
│   ├── routes/               # ttsRoutes.js
│   ├── services/             # ttsService.js
│   ├── middleware/           # validateRequest.js, errorHandler.js
│   ├── utils/                 # languages.js
│   ├── audio/                # generated audio files (gitignored)
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org) v18 or later (LTS recommended)
- npm (comes bundled with Node.js)
- Git (optional, for cloning/version control)

Verify your install:
```bash
node --version
npm --version
```

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/text-to-speech.git
cd text-to-speech
```

### 2. Set up the backend
```bash
cd server
npm install
copy .env.example .env      # Windows
npm run dev
```
The API will run at `http://localhost:5000`.

### 3. Set up the frontend
Open a **second terminal**:
```bash
cd client
npm install
copy .env.example .env      # Windows
npm run dev
```
The app will run at `http://localhost:5173`.

### 4. Use the app
Open `http://localhost:5173` in your browser, enter some text (up to 200 characters), select a language and voice, and click **Generate Speech**.

---

## Environment Variables

**`server/.env`**
```
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
MAX_TEXT_LENGTH=200
```

**`client/.env`**
```
VITE_API_BASE_URL=http://localhost:5000
```

---

## API Reference

| Method | Endpoint       | Description                          |
|--------|----------------|---------------------------------------|
| GET    | `/api/health`  | Health check                          |
| GET    | `/api/voices`  | Returns available languages and voices |
| POST   | `/api/tts`     | Converts text to speech                |

**POST `/api/tts`** request body:
```json
{
  "text": "Hello, welcome to the Text-to-Speech application.",
  "language": "en-US",
  "voice": "voice-1"
}
```

Response:
```json
{
  "success": true,
  "audioUrl": "/audio/speech-<uuid>.mp3"
}
```

---

## Known Limitations

- The free TTS provider offers one voice per language (no separate male/female options).
- Text is limited to ~200 characters per request.

Both limitations can be removed by integrating a paid provider (Google Cloud TTS, Azure Speech, Amazon Polly, or ElevenLabs) in `server/services/ttsService.js`.

---

## Deployment

- **Frontend**: Vercel or Netlify — build command `npm run build`, output directory `dist`, environment variable `VITE_API_BASE_URL` set to your deployed backend URL.
- **Backend**: Render or Railway — start command `npm start`, environment variables from `server/.env.example`, and `CLIENT_ORIGIN` set to your deployed frontend URL.

---

## License

This project is available for educational use. Add a license of your choice (e.g., MIT) if publishing publicly.