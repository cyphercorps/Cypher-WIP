// backend_cli/commands/notificationCommands.js

const { makeApiRequest } = require("../utils/apiRequest");
const { promptForInput } = require("../utils/promptHelper");
const logger = require("../utils/logger");
require("dotenv").config();

const BASE_URL = process.env.API_BASE_URL;

// Send a notification to a user
const sendNotification = async () => {
  try {
    const recipientId = await promptForInput("Enter recipient user ID:");
    const title = await promptForInput("Enter notification title:");
    const message = await promptForInput("Enter notification message:");

    const response = await makeApiRequest(
      "POST",
      `${BASE_URL}/api/notifications/send`,
      {
        recipientId,
        title,
        message,
      },
    );

    console.log("Notification sent successfully:", response);
    logger.logInfo("Notification sent successfully");
  } catch (error) {
    console.error("Failed to send notification:", error.message);
    logger.logCLIError("Notification sending failed", error);
  }
};

// Get all notifications for a user
const getUserNotifications = async () => {
  try {
    const userId = await promptForInput(
      "Enter user ID to fetch notifications:",
    );

    const response = await makeApiRequest(
      "GET",
      `${BASE_URL}/api/notifications/${userId}`,
    );
    console.log("User Notifications:", response);
    logger.logInfo("Fetched user notifications successfully");
  } catch (error) {
    console.error("Failed to fetch user notifications:", error.message);
    logger.logCLIError("Fetching notifications failed", error);
  }
};

// Mark a notification as read
const markNotificationAsRead = async () => {
  try {
    const userId = await promptForInput("Enter user ID:");
    const notificationId = await promptForInput(
      "Enter notification ID to mark as read:",
    );

    const response = await makeApiRequest(
      "PUT",
      `${BASE_URL}/api/notifications/${userId}/${notificationId}/read`,
    );
    console.log("Notification marked as read:", response.message);
    logger.logInfo("Notification marked as read successfully");
  } catch (error) {
    console.error("Failed to mark notification as read:", error.message);
    logger.logCLIError("Marking notification as read failed", error);
  }
};

module.exports = {
  sendNotification,
  getUserNotifications,
  markNotificationAsRead,
};
