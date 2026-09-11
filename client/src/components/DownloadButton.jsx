function DownloadButton({ audioUrl }) {
  if (!audioUrl) return null;

  const filename = audioUrl.split("/").pop();

  return (
    <a
      className="btn btn-secondary"
      href={audioUrl}
      download={filename}
    >
      Download Audio
    </a>
  );
}

export default DownloadButton;