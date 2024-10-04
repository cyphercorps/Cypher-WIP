const { deleteUser, grantFreeAccess, getPlatformStats } = require('../../src/controllers/employeeController'); // Import backend functions directly
const { promptForInput } = require('../utils/promptHelper');
const logger = require('../utils/logger');
require('dotenv').config();

// Delete a User
const deleteUserCommand = async () => {
  try {
    const uid = await promptForInput('Enter User ID to delete:');

    const req = { params: { uid } };
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

    await deleteUser(req, res, next);
    logger.logInfo('User deleted successfully');
  } catch (error) {
    console.error('Failed to delete user:', error.message);
    logger.logCLIError('Deleting user failed', error);
  }
};

// Grant Free Access
const grantFreeAccessCommand = async () => {
  try {
    const userId = await promptForInput('Enter User ID to grant free access:');
    const freeChannels = await promptForInput('Enter number of free channels:');
    const freeGroups = await promptForInput('Enter number of free groups:');

    const req = { body: { userId, freeChannels, freeGroups } };
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

    await grantFreeAccess(req, res, next);
    logger.logInfo('Free access granted successfully');
  } catch (error) {
    console.error('Failed to grant free access:', error.message);
    logger.logCLIError('Granting free access failed', error);
  }
};

// Get Platform Statistics
const getPlatformStatsCommand = async () => {
  try {
    const req = {};
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

    await getPlatformStats(req, res, next);
    logger.logInfo('Platform statistics fetched successfully');
  } catch (error) {
    console.error('Failed to fetch platform statistics:', error.message);
    logger.logCLIError('Fetching platform statistics failed', error);
  }
};

module.exports = {
  deleteUserCommand,
  grantFreeAccessCommand,
  getPlatformStatsCommand,
};