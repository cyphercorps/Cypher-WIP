// backend_cli/commands/conversationCommands.js

const { makeApiRequest } = require('../utils/apiRequest');
const { promptForInput } = require('../utils/promptHelper');
const logger = require('../utils/logger');
require('dotenv').config();

const BASE_URL = process.env.API_BASE_URL;

// Create a new conversation
const createConversation = async () => {
  try {
    const userId = await promptForInput('Enter your user ID:');
    const participants = await promptForInput('Enter participants (comma-separated IDs):');
    const type = await promptForInput('Select conversation type (direct, group, channel):');

    const response = await makeApiRequest('POST', `${BASE_URL}/api/conversations/create`, {
      userId,
      participants: participants.split(',').map((id) => id.trim()),
      type,
    });

    console.log('Conversation created successfully:', response);
    logger.logInfo('Conversation created successfully');
  } catch (error) {
    console.error('Failed to create conversation:', error.message);
    logger.logCLIError('Conversation creation failed', error);
  }
};

// Rename a conversation
const renameConversation = async () => {
  try {
    const conversationId = await promptForInput('Enter conversation ID:');
    const newName = await promptForInput('Enter new conversation name:');

    const response = await makeApiRequest('POST', `${BASE_URL}/api/conversations/rename`, {
      conversationId,
      newName,
    });

    console.log('Conversation renamed successfully:', response.message);
    logger.logInfo('Conversation renamed successfully');
  } catch (error) {
    console.error('Failed to rename conversation:', error.message);
    logger.logCLIError('Conversation rename failed', error);
  }
};

// Add participants to a group chat
const addParticipants = async () => {
  try {
    const conversationId = await promptForInput('Enter conversation ID:');
    const newParticipants = await promptForInput('Enter new participants (comma-separated IDs):');

    const response = await makeApiRequest('POST', `${BASE_URL}/api/conversations/add-participants`, {
      conversationId,
      newParticipants: newParticipants.split(',').map((id) => id.trim()),
    });

    console.log('Participants added successfully:', response.message);
    logger.logInfo('Participants added to conversation successfully');
  } catch (error) {
    console.error('Failed to add participants:', error.message);
    logger.logCLIError('Adding participants to conversation failed', error);
  }
};

// Delete a conversation
const deleteConversation = async () => {
  try {
    const conversationId = await promptForInput('Enter conversation ID:');
    const userId = await promptForInput('Enter user ID who is requesting deletion:');

    const response = await makeApiRequest('POST', `${BASE_URL}/api/conversations/delete-conversation`, {
      conversationId,
      userId,
    });

    console.log('Conversation deleted successfully:', response.message);
    logger.logInfo('Conversation deleted successfully');
  } catch (error) {
    console.error('Failed to delete conversation:', error.message);
    logger.logCLIError('Conversation deletion failed', error);
  }
};

// Pin a message in a conversation
const pinMessage = async () => {
  try {
    const conversationId = await promptForInput('Enter conversation ID:');
    const messageId = await promptForInput('Enter message ID to pin:');
    const pin = await promptForInput('Do you want to pin this message? (yes/no):');

    const response = await makeApiRequest('POST', `${BASE_URL}/api/conversations/pin-message`, {
      conversationId,
      messageId,
      pin: pin.toLowerCase() === 'yes',
    });

    console.log(`Message ${pin.toLowerCase() === 'yes' ? 'pinned' : 'unpinned'} successfully:`, response.message);
    logger.logInfo(`Message ${pin.toLowerCase() === 'yes' ? 'pinned' : 'unpinned'} successfully`);
  } catch (error) {
    console.error('Failed to pin/unpin message:', error.message);
    logger.logCLIError('Pinning/unpinning message failed', error);
  }
};

module.exports = {
  createConversation,
  renameConversation,
  addParticipants,
  deleteConversation,
  pinMessage,
};
