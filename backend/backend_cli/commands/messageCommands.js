// backend_cli/commands/messageCommands.js

const { makeApiRequest, makeMultipartApiRequest } = require('../utils/apiRequest');
const { promptForInput, promptForConfirmation } = require('../utils/promptHelper');
const logger = require('../utils/logger');
const fs = require('fs');
require('dotenv').config();

const BASE_URL = process.env.API_BASE_URL;

// Send a message within a conversation
const sendMessage = async () => {
  try {
    const conversationId = await promptForInput('Enter conversation ID:');
    const senderId = await promptForInput('Enter your user ID:');
    const message = await promptForInput('Enter the message to send:');
    const selfDestructTime = await promptForInput('Enter self-destruct time in milliseconds (optional):', true);

    const response = await makeApiRequest('POST', `${BASE_URL}/api/messages/send`, {
      conversationId,
      senderId,
      message,
      selfDestructTime: selfDestructTime || null,
    });
    console.log('Message sent successfully:', response);
    logger.logInfo('Message sent successfully');
  } catch (error) {
    console.error('Failed to send message:', error.message);
    logger.logCLIError('Message sending failed', error);
  }
};

// Edit a message
const editMessage = async () => {
  try {
    const conversationId = await promptForInput('Enter conversation ID:');
    const messageId = await promptForInput('Enter message ID to edit:');
    const newMessage = await promptForInput('Enter the new message:');

    const response = await makeApiRequest('POST', `${BASE_URL}/api/messages/edit-message`, {
      conversationId,
      messageId,
      newMessage,
    });
    console.log('Message edited successfully:', response.message);
    logger.logInfo('Message edited successfully');
  } catch (error) {
    console.error('Failed to edit message:', error.message);
    logger.logCLIError('Editing message failed', error);
  }
};

// Delete a message
const deleteMessage = async () => {
  try {
    const conversationId = await promptForInput('Enter conversation ID:');
    const messageId = await promptForInput('Enter message ID to delete:');

    const response = await makeApiRequest('POST', `${BASE_URL}/api/messages/delete-message`, {
      conversationId,
      messageId,
    });
    console.log('Message deleted successfully:', response.message);
    logger.logInfo('Message deleted successfully');
  } catch (error) {
    console.error('Failed to delete message:', error.message);
    logger.logCLIError('Deleting message failed', error);
  }
};

// Upload and send an image within a conversation
const uploadAndSendImage = async () => {
  try {
    const conversationId = await promptForInput('Enter conversation ID:');
    const senderId = await promptForInput('Enter your user ID:');
    const filePath = await promptForInput('Enter the path to the image file:');

    if (!fs.existsSync(filePath)) {
      console.error('Image file not found at the specified path');
      return;
    }

    const response = await makeMultipartApiRequest('POST', `${BASE_URL}/api/messages/upload-image`, {
      filePath,
      fieldName: 'image',
      additionalFields: { conversationId, senderId },
    });

    console.log('Image uploaded and message sent successfully:', response);
    logger.logInfo('Image message sent successfully');
  } catch (error) {
    console.error('Failed to upload and send image:', error.message);
    logger.logCLIError('Image upload failed', error);
  }
};

// Update read receipts for a conversation
const updateReadReceipts = async () => {
  try {
    const conversationId = await promptForInput('Enter conversation ID:');
    const userId = await promptForInput('Enter your user ID:');

    const response = await makeApiRequest('POST', `${BASE_URL}/api/messages/update-read-receipts`, {
      conversationId,
      userId,
    });
    console.log('Read receipts updated successfully:', response.message);
    logger.logInfo('Read receipts updated successfully');
  } catch (error) {
    console.error('Failed to update read receipts:', error.message);
    logger.logCLIError('Updating read receipts failed', error);
  }
};

// Typing indicator for a conversation
const typingIndicator = async () => {
  try {
    const conversationId = await promptForInput('Enter conversation ID:');
    const userId = await promptForInput('Enter your user ID:');
    const isTyping = await promptForConfirmation('Are you typing?');

    const response = await makeApiRequest('POST', `${BASE_URL}/api/messages/typing`, {
      conversationId,
      userId,
      isTyping,
    });
    console.log('Typing indicator updated successfully:', response.message);
    logger.logInfo('Typing indicator updated successfully');
  } catch (error) {
    console.error('Failed to update typing indicator:', error.message);
    logger.logCLIError('Typing indicator update failed', error);
  }
};

module.exports = {
  sendMessage,
  editMessage,
  deleteMessage,
  uploadAndSendImage,
  updateReadReceipts,
  typingIndicator,
};
