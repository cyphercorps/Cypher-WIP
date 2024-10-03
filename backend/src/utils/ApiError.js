// utils/ApiError.js

class ApiError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);  // Call the parent class's constructor with the error message
    this.statusCode = statusCode;  // Store the HTTP status code (default to 500)
    this.details = details;  // Optional details for more context about the error

    // Ensure that the error stack trace reflects this class name
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad Request', details = null) {
    return new ApiError(message, 400, details);
  }

  static unauthorized(message = 'Unauthorized', details = null) {
    return new ApiError(message, 401, details);
  }

  static forbidden(message = 'Forbidden', details = null) {
    return new ApiError(message, 403, details);
  }

  static notFound(message = 'Not Found', details = null) {
    return new ApiError(message, 404, details);
  }

  static conflict(message = 'Conflict', details = null) {
    return new ApiError(message, 409, details);
  }

  static internal(message = 'Internal Server Error', details = null) {
    return new ApiError(message, 500, details);
  }

  static customError(message, statusCode, details = null) {
    return new ApiError(message, statusCode, details);
  }
}

module.exports = ApiError;
