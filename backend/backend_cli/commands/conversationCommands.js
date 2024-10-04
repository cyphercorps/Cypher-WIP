const { createConversation, renameConversation, addParticipants, deleteConversation, pinMessage } = require('../../src/controllers/conversationController'); // Import backend functions directly
const { promptForInput } = require('../utils/promptHelper');
const logger = require('../utils/logger');
require('dotenv').config();

// Create a new conversation
const createConversationCommand = async () => {
  try {
    const userId = await promptForInput('Enter your user ID:');
    const participants = await promptForInput('Enter participants (comma-separated IDs):');
    const type = await promptForInput('Select conversation type (direct, group, channel):');

    const req = { body: { userId, participants: participants.split(',').map((id) => id.trim()), type } };
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

    await createConversation(req, res, next);
    logger.logInfo('Conversation created successfully');
  } catch (error) {
    console.error('Failed to create conversation:', error.message);
    logger.logCLIError('Conversation creation failed', error);
  }
};

// Rename a conversation
const renameConversationCommand = async () => {
  try {
    const conversationId = await promptForInput('Enter conversation ID:');
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
    logger.logCLIError('Conversation rename failed', error);
  }
};

// Add participants to a group chat
const addParticipantsCommand = async () => {
  try {
    const conversationId = await promptForInput('Enter conversation ID:');
    const newParticipants = await promptForInput('Enter new participants (comma-separated IDs):');

    const req = { body: { conversationId, newParticipants: newParticipants.split(',').map((id) => id.trim()) } };
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

    await addParticipants(req, res, next);
    logger.logInfo('Participants added to conversation successfully');
  } catch (error) {
    console.error('Failed to add participants:', error.message);
    logger.logCLIError('Adding participants to conversation failed', error);
  }
};

// Delete a conversation
const deleteConversationCommand = async () => {
  try {
    const conversationId = await promptForInput('Enter conversation ID:');
    const userId = await promptForInput('Enter user ID who is requesting deletion:');

    const req = { body: { conversationId, userId } };
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

    await deleteConversation(req, res, next);
    logger.logInfo('Conversation deleted successfully');
  } catch (error) {
    console.error('Failed to delete conversation:', error.message);
    logger.logCLIError('Conversation deletion failed', error);
  }
};

// Pin a message in a conversation
const pinMessageCommand = async () => {
  try {
    const conversationId = await promptForInput('Enter conversation ID:');
    const messageId = await promptForInput('Enter message ID to pin:');
    const pin = await promptForInput('Do you want to pin this message? (yes/no):');

    const req = { body: { conversationId, messageId, pin: pin.toLowerCase() === 'yes' } };
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
    logger.logInfo(`Message ${pin.toLowerCase() === 'yes' ? 'pinned' : 'unpinned'} successfully`);
  } catch (error) {
    console.error('Failed to pin/unpin message:', error.message);
    logger.logCLIError('Pinning/unpinning message failed', error);
  }
};

module.exports = {
  createConversationCommand,
  renameConversationCommand,
  addParticipantsCommand,
  deleteConversationCommand,
  pinMessageCommand,
};