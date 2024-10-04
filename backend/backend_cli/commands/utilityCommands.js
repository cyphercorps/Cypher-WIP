const { logInfo, logCLIError } = require('../utils/logger');
const { promptForInput } = require('../utils/promptHelper');
const { listDirectoryFiles, readFileContents } = require('../utils/fileUtils');
require('dotenv').config();

// Show Log Files
const showLogFilesCommand = async () => {
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
const viewLogFileCommand = async () => {
  try {
    const logFileName = await promptForInput('Enter log file name to view:');
    const logFilePath = `../../logs/${logFileName}`;
    const logData = readFileContents(logFilePath);

    console.log(`Contents of ${logFileName}:
`);
    console.log(logData);
    logInfo(`Displayed contents of log file: ${logFileName}`);
  } catch (error) {
    console.error('Failed to view log file:', error.message);
    logCLIError('Viewing log file failed', error);
  }
};

// List Available Commands
const listCommandsCommand = async () => {
  console.log('Available CLI Commands:');
  console.log('- deleteUser: Delete a user by ID');
  console.log('- grantFreeAccess: Grant free channels or groups to a user');
  console.log('- getPlatformStats: Get platform-wide statistics');
  console.log('- sendMessage: Send a message in a conversation');
  console.log('- editMessage: Edit a message in a conversation');
  console.log('- deleteMessage: Delete a message');
  console.log('- uploadAndSendImage: Upload and send an image in a conversation');
  console.log('- updateReadReceipts: Update read receipts for a conversation');
  console.log('- typingIndicator: Update typing status in a conversation');
  console.log('- createConversation: Create a new conversation');
  console.log('- renameConversation: Rename a conversation');
  console.log('- addParticipants: Add participants to a group chat');
  console.log('- removeParticipants: Remove participants from a group chat');
  console.log('- pinMessage: Pin or unpin a message in a conversation');
  console.log('- setParticipantPermissions: Set custom permissions for a participant in a conversation');
  logInfo('Displayed list of available commands');
};

module.exports = {
  showLogFilesCommand,
  viewLogFileCommand,
  listCommandsCommand,
};