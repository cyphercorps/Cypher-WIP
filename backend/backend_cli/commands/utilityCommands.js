// backend_cli/commands/utilityCommands.js

const { logInfo, logCLIError } = require('../utils/logger');
const { promptForInput } = require('../utils/promptHelper');
const { listDirectoryFiles, readFileContents } = require('../utils/fileUtils');
require('dotenv').config();

// Show Log Files
const showLogFiles = async () => {
  try {
    const logFiles = listDirectoryFiles('../../logs');
    console.log('Available Log Files:');
    logFiles.forEach(file => {
      console.log(file);
    });
    logInfo('Displayed list of log files');
  } catch (error) {
    console.error('Failed to fetch log files:', error.message);
    logCLIError('Fetching log files failed', error);
  }
};

// Display Specific Log File
const viewLogFile = async () => {
  try {
    const logFileName = await promptForInput('Enter log file name to view:');
    const logFilePath = `../../logs/${logFileName}`;
    const logData = readFileContents(logFilePath);

    console.log(`Contents of ${logFileName}:\n`);
    console.log(logData);
    logInfo(`Displayed contents of log file: ${logFileName}`);
  } catch (error) {
    console.error('Failed to view log file:', error.message);
    logCLIError('Viewing log file failed', error);
  }
};

// List Available Commands
const listCommands = async () => {
  console.log('Available CLI Commands:');
  console.log('- deleteUser: Delete a user by ID');
  console.log('- grantFreeAccess: Grant free channels or groups to a user');
  console.log('- getPlatformStats: Get platform-wide statistics');
  console.log('- sendMessage: Send a message in a conversation');
  console.log('- getMessages: Get messages in a conversation');
  console.log('- editMessage: Edit a message in a conversation');
  console.log('- deleteMessage: Delete a message (soft delete)');
  console.log('- updateReadReceipts: Update read receipts for a conversation');
  console.log('- typingIndicator: Update typing status in a conversation');
  console.log('- pinMessage: Pin a message in a conversation');
  console.log('- renameConversation: Rename a conversation');
  console.log('- uploadConversationProfilePhoto: Upload a profile photo for a conversation');
  logInfo('Displayed list of available commands');
};

module.exports = {
  showLogFiles,
  viewLogFile,
  listCommands,
};
