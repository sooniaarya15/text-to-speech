// Centralized error handler. Any error passed to next(err) or thrown
// inside an async route wrapped with asyncHandler ends up here.
function errorHandler(err, req, res, next) {
  console.error("[ERROR]", err.message);

  // Errors we throw ourselves from the TTS service carry a statusCode
  const statusCode = err.statusCode || 500;

  const isExternalFailure = statusCode === 502 || statusCode === 503;

  res.status(statusCode).json({
    success: false,
    error: isExternalFailure
      ? "The Text-to-Speech service is currently unavailable. Please try again later."
      : err.message || "Internal server error.",
  });
}

// Wrap async route handlers so thrown errors / rejected promises
// are forwarded to errorHandler instead of crashing the server.
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = { errorHandler, asyncHandler };