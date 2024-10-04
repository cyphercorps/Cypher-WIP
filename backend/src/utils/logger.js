// Enhanced Logger for backend and CLI
const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { combine, timestamp, printf } = format;
const path = require('path');

// Define custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Define log directory
const logDirectory = path.join(__dirname, '../../logs');

// Create a logger instance
const logger = createLogger({
  format: combine(
    timestamp(),  // Add timestamp to logs
    logFormat
  ),
  transports: [
    // Console transport to log to the console
    new transports.Console({
      level: 'info',  // Only show info and above (warn, error) in console
    }),

    // Daily rotate file transport for general logs (all levels)
    new DailyRotateFile({
      filename: `${logDirectory}/application-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,  // Compress log files
      maxSize: '20m',  // Maximum file size for each log file
      maxFiles: '30d',  // Keep logs for the last 30 days
      level: 'info',  // Log info, warn, and error levels
    }),

    // Daily rotate file transport for error logs (only errors)
    new DailyRotateFile({
      filename: `${logDirectory}/error-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',  // Log only errors to this file
    }),
  ],
});

// Specific logging functions for backend and CLI
const logBackendError = (message, errorDetails = null) => {
  const formattedMessage = `BACKEND ERROR: ${message}`;
  if (errorDetails) {
    logger.error(`${formattedMessage} - DETAILS: ${JSON.stringify(errorDetails)}`);
  } else {
    logger.error(formattedMessage);
  }
};

const logCLIError = (message, errorDetails = null) => {
  const formattedMessage = `CLI ERROR: ${message}`;
  if (errorDetails) {
    logger.error(`${formattedMessage} - DETAILS: ${JSON.stringify(errorDetails)}`);
  } else {
    logger.error(formattedMessage);
  }
};

const logInfo = (message) => {
  logger.info(message); // Modified to avoid prefixing 'INFO:' since Winston already adds the level
};

const logWarning = (message) => {
  logger.warn(`WARNING: ${message}`);
};

// Export logger functions individually and the main logger for direct use
module.exports = {
  info: (message) => logger.info(message),  // Export info log for direct use
  error: (message) => logger.error(message), // Export error log for direct use
  warn: (message) => logger.warn(message),   // Export warn log for direct use
  logBackendError,
  logCLIError,
  logInfo,
  logWarning,
  logger, // Export main logger if needed
};
