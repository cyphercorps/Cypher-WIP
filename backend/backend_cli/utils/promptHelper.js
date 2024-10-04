// backend_cli/utils/promptHelper.js

const inquirer = require('inquirer');

// Prompt for CLI password for access
const promptForCliPassword = async () => {
  const response = await inquirer.prompt([
    {
      type: 'password',
      name: 'password',
      message: 'Enter CLI Password:',
      mask: '*',
    },
  ]);
  return response.password;
};

// Prompt for user input with a dynamic message
const promptForInput = async (message, isPassword = false) => {
  const response = await inquirer.prompt([
    {
      type: isPassword ? 'password' : 'input',
      name: 'input',
      message,
      mask: isPassword ? '*' : undefined,
    },
  ]);
  return response.input;
};

module.exports = {
  promptForCliPassword,
  promptForInput,
};
