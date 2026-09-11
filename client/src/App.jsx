import { useEffect, useState } from "react";
import TextInput from "./components/TextInput";
import LanguageSelector from "./components/LanguageSelector";
import VoiceSelector from "./components/VoiceSelector";
import GenerateButton from "./components/GenerateButton";
import AudioPlayer from "./components/AudioPlayer";
import DownloadButton from "./components/DownloadButton";
import ErrorMessage from "./components/ErrorMessage";
import { fetchVoices, generateSpeech, API_BASE_URL } from "./services/api";

const MAX_TEXT_LENGTH = 200;

function App() {
  const [text, setText] = useState("");
  const [languages, setLanguages] = useState([]);
  const [voices, setVoices] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);

  // Load languages/voices from the backend on mount
  useEffect(() => {
    async function loadVoices() {
      try {
        const data = await fetchVoices();
        setLanguages(data.languages);
        setVoices(data.voices);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoadingVoices(false);
      }
    }
    loadVoices();
  }, []);

  // Reset the voice whenever the language changes
  function handleLanguageChange(langCode) {
    setSelectedLanguage(langCode);
    setSelectedVoice("");
  }

  function handleClear() {
    setText("");
    setAudioUrl("");
    setError("");
  }

  async function handleGenerate() {
    setError("");

    if (!text.trim()) {
      setError("Please enter some text before generating speech.");
      return;
    }
    if (text.length > MAX_TEXT_LENGTH) {
      setError(`Text exceeds the maximum of ${MAX_TEXT_LENGTH} characters.`);
      return;
    }
    if (!selectedLanguage) {
      setError("Please select a language.");
      return;
    }
    if (!selectedVoice) {
      setError("Please select a voice.");
      return;
    }

    setIsLoading(true);
    setAudioUrl("");

    try {
      const result = await generateSpeech({
        text: text.trim(),
        language: selectedLanguage,
        voice: selectedVoice,
      });
      // Backend returns a relative path like /audio/xyz.mp3
      setAudioUrl(`${API_BASE_URL}${result.audioUrl}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="card">
        <h1 className="app-title">Text to Speech</h1>
        <p className="app-subtitle">
          Convert written text into natural-sounding speech.
        </p>

        <ErrorMessage message={error} onDismiss={() => setError("")} />

        <TextInput
          text={text}
          onChange={setText}
          maxLength={MAX_TEXT_LENGTH}
        />

        {isLoadingVoices ? (
          <p className="loading-text">Loading languages and voices...</p>
        ) : (
          <div className="selectors-row">
            <LanguageSelector
              languages={languages}
              selectedLanguage={selectedLanguage}
              onChange={handleLanguageChange}
            />
            <VoiceSelector
              voices={voices}
              selectedLanguage={selectedLanguage}
              selectedVoice={selectedVoice}
              onChange={setSelectedVoice}
            />
          </div>
        )}

        <div className="button-row">
          <GenerateButton
            onClick={handleGenerate}
            isLoading={isLoading}
            disabled={isLoadingVoices}
          />
          <button type="button" className="btn btn-ghost" onClick={handleClear}>
            Clear
          </button>
        </div>

        <AudioPlayer audioUrl={audioUrl} />
        <DownloadButton audioUrl={audioUrl} />
      </div>
    </div>
  );
}

export default App;