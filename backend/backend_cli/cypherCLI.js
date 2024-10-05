// Main Cypher CLI Interface

const inquirer = require('inquirer');
const authCommands = require('./commands/authCommands');
const conversationCommands = require('./commands/conversationCommands');
const employeeCommands = require('./commands/employeeCommands');
const messageCommands = require('./commands/messageCommands');
const notificationCommands = require('./commands/notificationCommands');
const profileCommands = require('./commands/profileCommands');
const utilityCommands = require('./commands/utilityCommands');
const logger = require('./utils/logger');
require('dotenv').config();

const PASSWORD = 'AB62D';

// CLI Main Menu
const mainMenu = async () => {
  const { password } = await inquirer.prompt([
    { type: 'password', name: 'password', message: 'Enter the CLI access password:' },
  ]);

  if (password !== PASSWORD) {
    console.error('Incorrect password. Access denied.');
    logger.logCLIError('Incorrect password attempt to access CLI');
    return;
  }

  logger.logInfo('A Dev has accessed Cypher backend CLI! O.o O_o Welcome Developer! Lets begin debugging. O_o O.o');

  while (true) {
    const { commandGroup } = await inquirer.prompt([
      {
        type: 'list',
        name: 'commandGroup',
        message: 'Select a command group:',
        choices: [
          'Authentication',
          'Conversations',
          'Employee Commands',
          'Messages',
          'Notifications',
          'Profile',
          'Utilities',
          'Exit',
        ],
      },
    ]);

    if (commandGroup === 'Exit') {
      console.log('Exiting Cypher CLI...');
      logger.logInfo('User exited the CLI');
      break;
    }

    switch (commandGroup) {
      case 'Authentication':
        await handleAuthCommands();
        break;
      case 'Conversations':
        await handleConversationCommands();
        break;
      case 'Employee Commands':
        await handleEmployeeCommands();
        break;
      case 'Messages':
        await handleMessageCommands();
        break;
      case 'Notifications':
        await handleNotificationCommands();
        break;
      case 'Profile':
        await handleProfileCommands();
        break;
      case 'Utilities':
        await handleUtilityCommands();
        break;
    }
  }
};

// Handlers for each command group
const handleAuthCommands = async () => {
  const { authCommand } = await inquirer.prompt([
    {
      type: 'list',
      name: 'authCommand',
      message: 'Select an authentication command:',
      choices: [
        'Register User',
        'Login User',
        'Verify PIN',
        'Refresh Token',
        'Logout User',
        'Back',
      ],
    },
  ]);

  switch (authCommand) {
    case 'Register User':
      await authCommands.registerUser();
      break;
    case 'Login User':
      await authCommands.loginUser();
      break;
    case 'Verify PIN':
      await authCommands.verifyUserPin();
      break;
    case 'Refresh Token':
      await authCommands.refreshToken();
      break;
    case 'Logout User':
      await authCommands.logoutUser();
      break;
    case 'Back':
      return;
  }
};

const handleConversationCommands = async () => {
  const { conversationCommand } = await inquirer.prompt([
    {
      type: 'list',
      name: 'conversationCommand',
      message: 'Select a conversation command:',
      choices: [
        'Create Conversation',
        'Rename Conversation',
        'Add Participants',
        'Remove Participants',
        'Delete Conversation',
        'Set Group Admin',
        'Pin/Unpin Message',
        'Clear Conversation',
        'Leave Conversation',
        'Back',
      ],
    },
  ]);

  switch (conversationCommand) {
    case 'Create Conversation':
      await conversationCommands.createConversation();
      break;
    case 'Rename Conversation':
      await conversationCommands.renameConversation();
      break;
    case 'Add Participants':
      await conversationCommands.addParticipants();
      break;
    case 'Remove Participants':
      await conversationCommands.removeParticipants();
      break;
    case 'Delete Conversation':
      await conversationCommands.deleteConversation();
      break;
    case 'Set Group Admin':
      await conversationCommands.setGroupAdmin();
      break;
    case 'Pin/Unpin Message':
      await conversationCommands.pinMessage();
      break;
    case 'Clear Conversation':
      await conversationCommands.clearConversation();
      break;
    case 'Leave Conversation':
      await conversationCommands.leaveConversation();
      break;
    case 'Back':
      return;
  }
};

const handleEmployeeCommands = async () => {
  const { employeeCommand } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employeeCommand',
      message: 'Select an employee command:',
      choices: [
        'Delete User',
        'Grant Free Access',
        'Get Platform Stats',
        'Back',
      ],
    },
  ]);

  switch (employeeCommand) {
    case 'Delete User':
      await employeeCommands.deleteUser();
      break;
    case 'Grant Free Access':
      await employeeCommands.grantFreeAccess();
      break;
    case 'Get Platform Stats':
      await employeeCommands.viewStats();
      break;
    case 'Back':
      return;
  }
};

const handleMessageCommands = async () => {
  const { messageCommand } = await inquirer.prompt([
    {
      type: 'list',
      name: 'messageCommand',
      message: 'Select a message command:',
      choices: [
        'Send Message',
        'Edit Message',
        'Delete Message',
        'Upload and Send Image',
        'Update Read Receipts',
        'Typing Indicator',
        'Back',
      ],
    },
  ]);

  switch (messageCommand) {
    case 'Send Message':
      await messageCommands.sendMessage();
      break;
    case 'Edit Message':
      await messageCommands.editMessage();
      break;
    case 'Delete Message':
      await messageCommands.deleteMessage();
      break;
    case 'Upload and Send Image':
      await messageCommands.uploadAndSendImage();
      break;
    case 'Update Read Receipts':
      await messageCommands.updateReadReceipts();
      break;
    case 'Typing Indicator':
      await messageCommands.typingIndicator();
      break;
    case 'Back':
      return;
  }
};

const handleNotificationCommands = async () => {
  const { notificationCommand } = await inquirer.prompt([
    {
      type: 'list',
      name: 'notificationCommand',
      message: 'Select a notification command:',
      choices: [
        'Send Notification',
        'Get User Notifications',
        'Mark Notification as Read',
        'Back',
      ],
    },
  ]);

  switch (notificationCommand) {
    case 'Send Notification':
      await notificationCommands.sendNotification();
      break;
    case 'Get User Notifications':
      await notificationCommands.getUserNotifications();
      break;
    case 'Mark Notification as Read':
      await notificationCommands.markNotificationAsRead();
      break;
    case 'Back':
      return;
  }
};

const handleProfileCommands = async () => {
  const { profileCommand } = await inquirer.prompt([
    {
      type: 'list',
      name: 'profileCommand',
      message: 'Select a profile command:',
      choices: [
        'Get Profile',
        'Update Profile',
        'Upload Profile Photo',
        'Search Users by CypherTag',
        'Back',
      ],
    },
  ]);

  switch (profileCommand) {
    case 'Get Profile':
      await profileCommands.getProfile();
      break;
    case 'Update Profile':
      await profileCommands.updateProfile();
      break;
    case 'Upload Profile Photo':
      await profileCommands.uploadProfilePhoto();
      break;
    case 'Search Users by CypherTag':
      await profileCommands.searchUsers();
      break;
    case 'Back':
      return;
  }
};

const handleUtilityCommands = async () => {
  const { utilityCommand } = await inquirer.prompt([
    {
      type: 'list',
      name: 'utilityCommand',
      message: 'Select a utility command:',
      choices: [
        'Show Log Files',
        'View Specific Log File',
        'List All Commands',
        'Back',
      ],
    },
  ]);

  switch (utilityCommand) {
    case 'Show Log Files':
      await utilityCommands.showLogFiles();
      break;
    case 'View Specific Log File':
      await utilityCommands.viewLogFile();
      break;
    case 'List All Commands':
      await utilityCommands.listCommands();
      break;
    case 'Back':
      return;
  }
};

// Export all functions along with the main CLI entry point
module.exports = {
  mainMenu,
  handleAuthCommands,
  handleConversationCommands,
  handleEmployeeCommands,
  handleMessageCommands,
  handleNotificationCommands,
  handleProfileCommands,
  handleUtilityCommands,
};