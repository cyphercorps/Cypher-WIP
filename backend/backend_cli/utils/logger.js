// Enhanced Logger for backend and CLI

const fs = require('fs');
const path = require('path');
const winston = require('winston');
require('winston-daily-rotate-file');

// Define logs directory
const logDirectory = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Create Winston logger with log rotation
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      filename: path.join(logDirectory, 'cypher-log-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
    }),
  ],
});

// Log levels for backend and CLI
const logLevels = {
  ERROR: 'error',
  INFO: 'info',
  WARN: 'warn',
};

// General logging function
const log = (level, message) => {
  logger.log({ level, message });
};

// Logging function for backend errors
const logBackendError = (message, errorDetails = null) => {
  const formattedMessage = `BACKEND ERROR: ${message}`;
  if (errorDetails) {
    log(logLevels.ERROR, `${formattedMessage} - DETAILS: ${JSON.stringify(errorDetails)}`);
  } else {
    log(logLevels.ERROR, formattedMessage);
  }
};

// Logging function for CLI errors
const logCLIError = (message, errorDetails = null) => {
  const formattedMessage = `CLI ERROR: ${message}`;
  if (errorDetails) {
    log(logLevels.ERROR, `${formattedMessage} - DETAILS: ${JSON.stringify(errorDetails)}`);
  } else {
    log(logLevels.ERROR, formattedMessage);
  }
};

// Logging function for general information
const logInfo = (message) => {
  log(logLevels.INFO, `INFO: ${message}`);
};

// Logging function for warnings
const logWarning = (message) => {
  log(logLevels.WARN, `WARNING: ${message}`);
};

module.exports = {
  log,
  logBackendError,
  logCLIError,
  logInfo,
  logWarning,
};