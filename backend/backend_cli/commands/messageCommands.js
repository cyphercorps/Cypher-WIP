const { sendMessage, editMessage, deleteMessage, uploadAndSendImage, updateReadReceipts, typingIndicator } = require('../../src/controllers/messageController'); // Import backend functions directly
const { promptForInput, promptForConfirmation } = require('../utils/promptHelper');
const logger = require('../utils/logger');
const fs = require('fs');
require('dotenv').config();

// Send a message within a conversation
const sendMessageCommand = async () => {
  try {
    const conversationId = await promptForInput('Enter conversation ID:');
    const senderId = await promptForInput('Enter your user ID:');
    const message = await promptForInput('Enter the message to send:');
    const selfDestructTime = await promptForInput('Enter self-destruct time in milliseconds (optional):', true);

    const req = { body: { conversationId, senderId, message, selfDestructTime: selfDestructTime || null } };
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

    await sendMessage(req, res, next);
    logger.logInfo('Message sent successfully');
  } catch (error) {
    console.error('Failed to send message:', error.message);
    logger.logCLIError('Message sending failed', error);
  }
};

// Edit a message
const editMessageCommand = async () => {
  try {
    const conversationId = await promptForInput('Enter conversation ID:');
    const messageId = await promptForInput('Enter message ID to edit:');
    const newMessage = await promptForInput('Enter the new message:');

    const req = { body: { conversationId, messageId, newMessage } };
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

    await editMessage(req, res, next);
    logger.logInfo('Message edited successfully');
  } catch (error) {
    console.error('Failed to edit message:', error.message);
    logger.logCLIError('Editing message failed', error);
  }
};

// Delete a message
const deleteMessageCommand = async () => {
  try {
    const conversationId = await promptForInput('Enter conversation ID:');
    const messageId = await promptForInput('Enter message ID to delete:');

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

    await deleteMessage(req, res, next);
    logger.logInfo('Message deleted successfully');
  } catch (error) {
    console.error('Failed to delete message:', error.message);
    logger.logCLIError('Deleting message failed', error);
  }
};

// Upload and send an image within a conversation
const uploadAndSendImageCommand = async () => {
  try {
    const conversationId = await promptForInput('Enter conversation ID:');
    const senderId = await promptForInput('Enter your user ID:');
    const filePath = await promptForInput('Enter the path to the image file:');

    if (!fs.existsSync(filePath)) {
      console.error('Image file not found at the specified path');
      return;
    }

    const req = { params: { conversationId }, body: { senderId }, file: { path: filePath, fieldName: 'image' } };
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

    await uploadAndSendImage(req, res, next);
    logger.logInfo('Image uploaded and message sent successfully');
  } catch (error) {
    console.error('Failed to upload and send image:', error.message);
    logger.logCLIError('Image upload failed', error);
  }
};

// Update read receipts for a conversation
const updateReadReceiptsCommand = async () => {
  try {
    const conversationId = await promptForInput('Enter conversation ID:');
    const userId = await promptForInput('Enter your user ID:');

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

    await updateReadReceipts(req, res, next);
    logger.logInfo('Read receipts updated successfully');
  } catch (error) {
    console.error('Failed to update read receipts:', error.message);
    logger.logCLIError('Updating read receipts failed', error);
  }
};

// Typing indicator for a conversation
const typingIndicatorCommand = async () => {
  try {
    const conversationId = await promptForInput('Enter conversation ID:');
    const userId = await promptForInput('Enter your user ID:');
    const isTyping = await promptForConfirmation('Are you typing?');

    const req = { body: { conversationId, userId, isTyping } };
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

    await typingIndicator(req, res, next);
    logger.logInfo('Typing indicator updated successfully');
  } catch (error) {
    console.error('Failed to update typing indicator:', error.message);
    logger.logCLIError('Typing indicator update failed', error);
  }
};

module.exports = {
  sendMessageCommand,
  editMessageCommand,
  deleteMessageCommand,
  uploadAndSendImageCommand,
  updateReadReceiptsCommand,
  typingIndicatorCommand,
};