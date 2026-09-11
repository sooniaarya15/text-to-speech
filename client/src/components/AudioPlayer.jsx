function AudioPlayer({ audioUrl }) {
  if (!audioUrl) return null;

  return (
    <div className="field-group">
      <label className="field-label">Generated Audio</label>
      <audio className="audio-player" controls src={audioUrl}>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default AudioPlayer;