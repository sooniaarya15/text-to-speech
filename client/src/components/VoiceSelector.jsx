function VoiceSelector({ voices, selectedLanguage, selectedVoice, onChange }) {
  const availableVoices = voices.filter((v) => v.language === selectedLanguage);

  return (
    <div className="field-group">
      <label htmlFor="voice-select" className="field-label">
        Voice
      </label>
      <select
        id="voice-select"
        className="select-input"
        value={selectedVoice}
        onChange={(e) => onChange(e.target.value)}
        disabled={!selectedLanguage}
      >
        <option value="" disabled>
          {selectedLanguage ? "Select a voice" : "Select a language first"}
        </option>
        {availableVoices.map((voice) => (
          <option key={voice.id} value={voice.id}>
            {voice.name} {voice.gender ? `(${voice.gender})` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}

export default VoiceSelector;