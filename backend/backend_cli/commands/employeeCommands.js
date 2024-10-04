// backend_cli/commands/employeeCommands.js

const {
  makeApiRequest,
  makeMultipartApiRequest,
} = require("../utils/apiRequest");
const { promptForInput } = require("../utils/promptHelper");
const logger = require("../utils/logger");
require("dotenv").config();
const fs = require("fs");

const BASE_URL = process.env.API_BASE_URL;

// Delete a User
const deleteUser = async () => {
  try {
    const uid = await promptForInput("Enter User ID to delete:");
    const response = await makeApiRequest(
      "DELETE",
      `${BASE_URL}/api/employee/delete-user/${uid}`,
    );
    console.log("User deleted successfully:", response);
    logger.logInfo("User deleted successfully");
  } catch (error) {
    console.error("Failed to delete user:", error.message);
    logger.logCLIError("Deleting user failed", error);
  }
};

// Grant Free Access
const grantFreeAccess = async () => {
  try {
    const userId = await promptForInput("Enter User ID to grant free access:");
    const freeChannels = await promptForInput("Enter number of free channels:");
    const freeGroups = await promptForInput("Enter number of free groups:");

    const response = await makeApiRequest(
      "POST",
      `${BASE_URL}/api/employee/grant-free-access`,
      {
        userId,
        freeChannels,
        freeGroups,
      },
    );
    console.log("Free access granted successfully:", response);
    logger.logInfo("Free access granted successfully");
  } catch (error) {
    console.error("Failed to grant free access:", error.message);
    logger.logCLIError("Granting free access failed", error);
  }
};

// Get Platform Statistics
const getPlatformStats = async () => {
  try {
    const response = await makeApiRequest(
      "GET",
      `${BASE_URL}/api/employee/platform-stats`,
    );
    console.log("Platform Statistics:", response);
    logger.logInfo("Platform statistics fetched successfully");
  } catch (error) {
    console.error("Failed to fetch platform statistics:", error.message);
    logger.logCLIError("Fetching platform statistics failed", error);
  }
};

// Upload Conversation Profile Photo
const uploadConversationProfilePhoto = async () => {
  try {
    const conversationId = await promptForInput("Enter Conversation ID:");
    const imagePath = await promptForInput("Enter path to the image file:");

    if (!fs.existsSync(imagePath)) {
      console.error("Image file not found at the specified path");
      return;
    }

    const response = await makeMultipartApiRequest(
      "POST",
      `${BASE_URL}/api/employee/conversation/${conversationId}/upload-photo`,
      {
        filePath: imagePath,
        fieldName: "profilePhoto",
      },
    );

    console.log("Profile photo uploaded successfully:", response);
    logger.logInfo("Conversation profile photo uploaded successfully");
  } catch (error) {
    console.error("Failed to upload profile photo:", error.message);
    logger.logCLIError("Uploading conversation profile photo failed", error);
  }
};

// Pin a Message
const pinMessage = async () => {
  try {
    const conversationId = await promptForInput("Enter Conversation ID:");
    const messageId = await promptForInput("Enter Message ID to pin:");

    const response = await makeApiRequest(
      "POST",
      `${BASE_URL}/api/employee/conversation/pin-message`,
      {
        conversationId,
        messageId,
      },
    );

    console.log("Message pinned successfully:", response.message);
    logger.logInfo("Message pinned successfully");
  } catch (error) {
    console.error("Failed to pin message:", error.message);
    logger.logCLIError("Pinning message failed", error);
  }
};

// Rename a Conversation
const renameConversation = async () => {
  try {
    const conversationId = await promptForInput("Enter Conversation ID:");
    const newName = await promptForInput("Enter new conversation name:");

    const response = await makeApiRequest(
      "POST",
      `${BASE_URL}/api/employee/conversation/rename`,
      {
        conversationId,
        newName,
      },
    );

    console.log("Conversation renamed successfully:", response.message);
    logger.logInfo("Conversation renamed successfully");
  } catch (error) {
    console.error("Failed to rename conversation:", error.message);
    logger.logCLIError("Renaming conversation failed", error);
  }
};

module.exports = {
  deleteUser,
  grantFreeAccess,
  getPlatformStats,
  uploadConversationProfilePhoto,
  pinMessage,
  renameConversation,
};
