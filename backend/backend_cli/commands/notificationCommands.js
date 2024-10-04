const { sendNotification, getUserNotifications, markNotificationAsRead } = require('../../src/controllers/notificationController'); // Import backend functions directly
const { promptForInput } = require('../utils/promptHelper');
const logger = require('../utils/logger');
require('dotenv').config();

// Send a notification to a user
const sendNotificationCommand = async () => {
  try {
    const recipientId = await promptForInput('Enter recipient user ID:');
    const title = await promptForInput('Enter notification title:');
    const message = await promptForInput('Enter notification message:');

    const req = { body: { recipientId, title, message } };
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

    await sendNotification(req, res, next);
    logger.logInfo('Notification sent successfully');
  } catch (error) {
    console.error('Failed to send notification:', error.message);
    logger.logCLIError('Notification sending failed', error);
  }
};

// Get all notifications for a user
const getUserNotificationsCommand = async () => {
  try {
    const userId = await promptForInput('Enter user ID to fetch notifications:');

    const req = { params: { userId } };
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

    await getUserNotifications(req, res, next);
    logger.logInfo('Fetched user notifications successfully');
  } catch (error) {
    console.error('Failed to fetch user notifications:', error.message);
    logger.logCLIError('Fetching notifications failed', error);
  }
};

// Mark a notification as read
const markNotificationAsReadCommand = async () => {
  try {
    const userId = await promptForInput('Enter user ID:');
    const notificationId = await promptForInput('Enter notification ID to mark as read:');

    const req = { params: { userId, notificationId } };
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

    await markNotificationAsRead(req, res, next);
    logger.logInfo('Notification marked as read successfully');
  } catch (error) {
    console.error('Failed to mark notification as read:', error.message);
    logger.logCLIError('Marking notification as read failed', error);
  }
};

module.exports = {
  sendNotificationCommand,
  getUserNotificationsCommand,
  markNotificationAsReadCommand,
};