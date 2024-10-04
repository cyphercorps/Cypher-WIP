const { deleteUser, grantFreeAccess, getPlatformStats, uploadConversationProfilePhoto, pinMessage, renameConversation } = require('../../src/controllers/employeeController'); // Import backend functions directly
const { promptForInput } = require('../utils/promptHelper');
const logger = require('../utils/logger');
require('dotenv').config();
const fs = require('fs');

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

// Upload Conversation Profile Photo
const uploadConversationProfilePhotoCommand = async () => {
  try {
    const conversationId = await promptForInput('Enter Conversation ID:');
    const imagePath = await promptForInput('Enter path to the image file:');

    if (!fs.existsSync(imagePath)) {
      console.error('Image file not found at the specified path');
      return;
    }

    const req = { params: { conversationId }, file: { path: imagePath, fieldName: 'profilePhoto' } };
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

    await uploadConversationProfilePhoto(req, res, next);
    logger.logInfo('Conversation profile photo uploaded successfully');
  } catch (error) {
    console.error('Failed to upload profile photo:', error.message);
    logger.logCLIError('Uploading conversation profile photo failed', error);
  }
};

// Pin a Message
const pinMessageCommand = async () => {
  try {
    const conversationId = await promptForInput('Enter Conversation ID:');
    const messageId = await promptForInput('Enter Message ID to pin:');

    const req = { body: { conversationId, messageId } };
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

    await pinMessage(req, res, next);
    logger.logInfo('Message pinned successfully');
  } catch (error) {
    console.error('Failed to pin message:', error.message);
    logger.logCLIError('Pinning message failed', error);
  }
};

// Rename a Conversation
const renameConversationCommand = async () => {
  try {
    const conversationId = await promptForInput('Enter Conversation ID:');
    const newName = await promptForInput('Enter new conversation name:');

    const req = { body: { conversationId, newName } };
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

    await renameConversation(req, res, next);
    logger.logInfo('Conversation renamed successfully');
  } catch (error) {
    console.error('Failed to rename conversation:', error.message);
    logger.logCLIError('Renaming conversation failed', error);
  }
};

module.exports = {
  deleteUserCommand,
  grantFreeAccessCommand,
  getPlatformStatsCommand,
  uploadConversationProfilePhotoCommand,
  pinMessageCommand,
  renameConversationCommand,
};