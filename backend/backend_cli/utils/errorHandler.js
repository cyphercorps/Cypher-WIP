// backend_cli/utils/errorHandler.js

const logger = require('../utils/logger');

const handleError = (error, context) => {
  logger.logCLIError(`Error in ${context}`, error.message);
  console.error(`[ERROR] ${context}: ${error.message}`);
};

module.exports = {
  handleError,
};
