// backend_cli/utils/apiRequest.js

const axios = require('axios');
const logger = require('../utils/logger');

// Generic function for making API requests
const makeApiRequest = async (method, endpoint, data = null, headers = {}) => {
  try {
    const response = await axios({
      method,
      url: endpoint,
      data,
      headers,
    });
    return response.data;
  } catch (error) {
    logger.logCLIError(`Failed to make request to ${endpoint}`, error.message);
    throw error; // Re-throw for higher-level error handling
  }
};

module.exports = {
  makeApiRequest,
};
