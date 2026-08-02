function errorHandler(err, req, res, next) {
  console.error(err.stack);

  const status = err.statusCode || 500;

  // Only trust err.message for errors WE threw on purpose (they always set statusCode).
  // Anything without a statusCode is an unexpected/internal error (e.g. a raw Postgres
  // driver error) and should never be echoed back to the client verbatim.
  const message = err.statusCode ? err.message : 'Something went wrong. Please try again.';

  res.status(status).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;