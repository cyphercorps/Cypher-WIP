// middleware/errorMiddleware.js
module.exports = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging

  // Determine the status code to send (default to 500 if not specified)
  const statusCode = err.statusCode || 500;

  // Send a JSON response with the error message
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    statusCode,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack // Hide stack trace in production
  });
};
