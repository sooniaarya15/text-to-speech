function GenerateButton({ onClick, isLoading, disabled }) {
  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <span className="spinner" aria-hidden="true" />
          Generating...
        </>
      ) : (
        "Generate Speech"
      )}
    </button>
  );
}

export default GenerateButton;