const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { combine, timestamp, printf } = format;

// Define custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

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
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,  // Compress log files
      maxSize: '20m',  // Maximum file size for each log file
      maxFiles: '30d',  // Keep logs for the last 30 days
      level: 'info',  // Log info, warn, and error levels
    }),

    // Daily rotate file transport for error logs (only errors)
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',  // Log only errors to this file
    }),
  ],
});

// Export the logger
module.exports = logger;
