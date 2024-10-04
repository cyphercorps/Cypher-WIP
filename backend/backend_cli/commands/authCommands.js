const { register, login, verifyPin, resetPassword, logout } = require('../../src/controllers/authController'); // Import backend functions directly
const logger = require('../utils/logger'); // Import logger utility
const { promptForInput } = require('../utils/promptHelper');
require('dotenv').config();

// Register User Command
const registerUser = async () => {
  try {
    const cypherTag = await promptForInput('Enter your CypherTag:');
    const password = await promptForInput('Enter your password:', true);
    const pin = await promptForInput('Enter your 6-digit PIN:', true);

    const req = { body: { cypherTag, password, pin } };
    const res = {
    uid: null,
    status: (code) => ({
      json: (data) => {
        if (data.uid) {
          this.uid = data.uid;
        }
          console.log(`Status: ${code}, Response:`, data);
        },
      }),
    };
    const next = (error) => {
      if (error) {
        throw error;
      }
    };

    await register(req, res, next);
    logger.logInfo('User registration successful');
  } catch (error) {
    console.error('Failed to register user:', error.message);
    logger.logCLIError('User registration failed', error);
  }
};

// Login User Command
const loginUser = async () => {
  try {
    const cypherTag = await promptForInput('Enter your CypherTag:');
    const password = await promptForInput('Enter your password:', true);
    const cypherEncryptionOrigin = await promptForInput('Enter Cypher Encryption Origin (if applicable):');

    const req = { body: { cypherTag, password, cypherEncryptionOrigin } };
    const res = {
      status: (code) => ({
        json: (data) => {
          console.log(`Status: ${code}, Response:`, data);
        },
      }),
    };
    const next = (error) => {
      if (error) {
        throw error;
      }
    };

    await login(req, res, next);
    if (res.uid) {
      console.log(`User ID: ${res.uid}`);
    }
    logger.logInfo('User login successful');
  } catch (error) {
    console.error('Failed to login user:', error.message);
    logger.logCLIError('User login failed', error);
  }
};

// Verify PIN Command
const verifyUserPin = async () => {
  try {
    const uid = await promptForInput('Enter your UID:');
    const pin = await promptForInput('Enter your PIN:', true);

    const req = { body: { uid, pin } };
    const res = {
      status: (code) => ({
        json: (data) => {
          console.log(`Status: ${code}, Response:`, data);
        },
      }),
    };
    const next = (error) => {
      if (error) {
        throw error;
      }
    };

    await verifyPin(req, res, next);
    logger.logInfo('PIN verification successful');
  } catch (error) {
    console.error('Failed to verify PIN:', error.message);
    logger.logCLIError('PIN verification failed', error);
  }
};

// Reset Password Command
const resetUserPassword = async () => {
  try {
    const uid = await promptForInput('Enter your UID:');
    const pin = await promptForInput('Enter your PIN:', true);
    const newPassword = await promptForInput('Enter your new password:', true);

    const req = { body: { uid, pin, newPassword } };
    const res = {
      status: (code) => ({
        json: (data) => {
          console.log(`Status: ${code}, Response:`, data);
        },
      }),
    };
    const next = (error) => {
      if (error) {
        throw error;
      }
    };

    await resetPassword(req, res, next);
    logger.logInfo('Password reset successful');
  } catch (error) {
    console.error('Failed to reset password:', error.message);
    logger.logCLIError('Password reset failed', error);
  }
};

// Logout User Command
const logoutUser = async () => {
  try {
    const uid = await promptForInput('Enter your UID:');

    const req = { body: { uid } };
    const res = {
      status: (code) => ({
        json: (data) => {
          console.log(`Status: ${code}, Response:`, data);
        },
      }),
    };
    const next = (error) => {
      if (error) {
        throw error;
      }
    };

    await logout(req, res, next);
    logger.logInfo('User logout successful');
  } catch (error) {
    console.error('Failed to logout user:', error.message);
    logger.logCLIError('User logout failed', error);
  }
};

// Export commands
module.exports = {
  registerUser,
  loginUser,
  verifyUserPin, // Updated name here
  resetUserPassword,
  logoutUser,
};