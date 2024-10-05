// employeeCommands.js

const inquirer = require('inquirer');
const path = require('path');
const { deleteUser, grantFreeAccess, getPlatformStats } = require(path.resolve(__dirname, '../../src/controllers/employeeController'));

// Delete a user account
const deleteUserAccount = async () => {
  const { userId } = await inquirer.prompt([
    { type: 'input', name: 'userId', message: 'Enter userId to delete:' },
  ]);
  await deleteUser({ params: { uid: userId } }, { status: (code) => ({ json: console.log }) }, console.error);
};

// Grant free channel/group chat creation
const grantFreeCreation = async () => {
  const { userId, freeChannels, freeGroups } = await inquirer.prompt([
    { type: 'input', name: 'userId', message: 'Enter userId to grant free channel/group chat creation:' },
    { type: 'input', name: 'freeChannels', message: 'Enter number of free channels:' },
    { type: 'input', name: 'freeGroups', message: 'Enter number of free groups:' },
  ]);
  await grantFreeAccess({ body: { userId, freeChannels, freeGroups } }, { status: (code) => ({ json: console.log }) }, console.error);
};

// View total users, messages, and conversations
const viewStats = async () => {
  await getPlatformStats({}, { status: (code) => ({ json: console.log }) }, console.error);
};

// Menu to choose command
const menu = async () => {
  const { option } = await inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: 'Employee Commands:',
      choices: [
        'Delete User Account',
        'Grant Free Channel/Group Chat Creation',
        'View Total Users, Messages, and Conversations',
        'Exit'
      ],
    },
  ]);

  switch (option) {
    case 'Delete User Account':
      await deleteUserAccount();
      break;
    case 'Grant Free Channel/Group Chat Creation':
      await grantFreeCreation();
      break;
    case 'View Total Users, Messages, and Conversations':
      await viewStats();
      break;
    case 'Exit':
      console.log('Exiting Employee Commands');
      return;
    default:
      console.log('Invalid option');
  }

  await menu(); // Show menu again after completing a command
};

module.exports = {
  deleteUserAccount,
  grantFreeCreation,
  viewStats,
  menu
};