// backend_cli/utils/config.js

require('dotenv').config();

const getBackendUrl = () => {
  if (!process.env.BACKEND_URL) {
    throw new Error('BACKEND_URL not set in environment variables');
  }
  return process.env.BACKEND_URL;
};

// Password required for CLI access
const getCliPassword = () => {
  if (!process.env.CLI_PASSWORD) {
    throw new Error('CLI_PASSWORD not set in environment variables');
  }
  return process.env.CLI_PASSWORD;
};

module.exports = {
  getBackendUrl,
  getCliPassword,
};
