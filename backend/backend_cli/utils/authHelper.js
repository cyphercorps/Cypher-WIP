// backend_cli/utils/authHelper.js

const fs = require('fs');
const path = require('path');
const { makeApiRequest } = require('./apiRequest');
const { getBackendUrl } = require('./config');
const logger = require('./logger');

const tokenFilePath = path.join(__dirname, '../../auth_tokens.json');

// Store tokens (both access and refresh)
const storeTokens = (tokens) => {
  fs.writeFileSync(tokenFilePath, JSON.stringify(tokens));
};

// Retrieve tokens from file
const retrieveTokens = () => {
  if (fs.existsSync(tokenFilePath)) {
    const tokens = JSON.parse(fs.readFileSync(tokenFilePath));
    return tokens;
  }
  return null;
};

// Get a new access token using refresh token
const refreshAccessToken = async () => {
  const tokens = retrieveTokens();
  if (!tokens || !tokens.refreshToken) {
    throw new Error('No refresh token available for refreshing access token');
  }

  try {
    const response = await makeApiRequest('POST', `${getBackendUrl()}/api/auth/refresh-token`, { refreshToken: tokens.refreshToken });
    storeTokens({ ...tokens, accessToken: response.accessToken });
    logger.logInfo('Access token successfully refreshed.');
    return response.accessToken;
  } catch (error) {
    logger.logCLIError('Failed to refresh access token', error.message);
    throw error;
  }
};

module.exports = {
  storeTokens,
  retrieveTokens,
  refreshAccessToken,
};
