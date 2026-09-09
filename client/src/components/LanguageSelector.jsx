// src/components/LanguageSelector.jsx
function LanguageSelector({ languages, selectedLanguage, onChange }) {
  return (
    <div className="field-group">
      <label htmlFor="language-select" className="field-label">
        Language
      </label>
      <select
        id="language-select"
        className="select-input"
        value={selectedLanguage}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          Select a language
        </option>
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSelector;