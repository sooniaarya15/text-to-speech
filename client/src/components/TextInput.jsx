function TextInput({ text, onChange, maxLength }) {
  const charCount = text.length;
  const wordCount = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
  const isOverLimit = charCount > maxLength;

  return (
    <div className="field-group">
      <label htmlFor="tts-text" className="field-label">
        Enter your text
      </label>
      <textarea
        id="tts-text"
        className={`text-area ${isOverLimit ? "text-area--error" : ""}`}
        rows={6}
        placeholder="Type or paste the text you want converted to speech..."
        value={text}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="text-meta">
        <span className={isOverLimit ? "meta-error" : ""}>
          Characters: {charCount} / {maxLength}
        </span>
        <span>Words: {wordCount}</span>
      </div>
    </div>
  );
}

export default TextInput;