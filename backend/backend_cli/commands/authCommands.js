// backend_cli/commands/authCommands.js

const { makeApiRequest } = require('../utils/apiRequest');
const { promptForInput } = require('../utils/promptHelper');
const { storeTokens } = require('../utils/authHelper');
const logger = require('../utils/logger');
require('dotenv').config();

const BASE_URL = process.env.API_BASE_URL;

// Register a new user
const registerUser = async () => {
  try {
    const cypherTag = await promptForInput('Enter your CypherTag:');
    const password = await promptForInput('Enter your password:', true); // Masked input for password
    const pin = await promptForInput('Enter your 6-digit PIN:', true); // Masked input for PIN

    const response = await makeApiRequest('POST', `${BASE_URL}/api/auth/register`, {
      cypherTag,
      password,
      pin,
    });

    console.log('User registered successfully:', response.message);
    logger.logInfo('User registration successful');
  } catch (error) {
    console.error('Failed to register user:', error.message);
    logger.logCLIError('User registration failed', error);
  }
};

// User login (Step 1: CypherTag/Password)
const loginUser = async () => {
  try {
    const cypherTag = await promptForInput('Enter your CypherTag:');
    const password = await promptForInput('Enter your password:', true); // Masked input for password

    const response = await makeApiRequest('POST', `${BASE_URL}/api/auth/login`, {
      cypherTag,
      password,
    });

    console.log(response.message);
    logger.logInfo('User login successful, awaiting PIN verification');
  } catch (error) {
    console.error('Failed to login:', error.message);
    logger.logCLIError('User login failed', error);
  }
};

// PIN Verification (Step 2)
const verifyPin = async () => {
  try {
    const uid = await promptForInput('Enter your UID:');
    const pin = await promptForInput('Enter your 6-digit PIN:', true); // Masked input for PIN

    const response = await makeApiRequest('POST', `${BASE_URL}/api/auth/verify-pin`, {
      uid,
      pin,
    });

    console.log('Login verified. Token:', response.accessToken);
    logger.logInfo('PIN verification successful');

    // Store the tokens in a secure location
    storeTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
  } catch (error) {
    console.error('Failed to verify PIN:', error.message);
    logger.logCLIError('PIN verification failed', error);
  }
};

// Refresh Access Token
const refreshToken = async () => {
  try {
    const refreshTokenInput = await promptForInput('Enter your refresh token:');

    const response = await makeApiRequest('POST', `${BASE_URL}/api/auth/refresh-token`, {
      refreshToken: refreshTokenInput,
    });

    console.log('New Access Token:', response.accessToken);
    logger.logInfo('Access token refreshed successfully');
  } catch (error) {
    console.error('Failed to refresh token:', error.message);
    logger.logCLIError('Token refresh failed', error);
  }
};

// User logout
const logoutUser = async () => {
  try {
    const uid = await promptForInput('Enter your UID:');

    await makeApiRequest('POST', `${BASE_URL}/api/auth/logout`, {
      uid,
    });

    console.log('User logged out successfully');
    logger.logInfo('User logout successful');
  } catch (error) {
    console.error('Failed to logout:', error.message);
    logger.logCLIError('User logout failed', error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyPin,
  refreshToken,
  logoutUser,
};
