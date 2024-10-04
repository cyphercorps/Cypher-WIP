// backend_cli/utils/validateInput.js

// Validate CypherTag format
const validateCypherTag = (cypherTag) => {
  return /^[a-zA-Z0-9_]{3,15}$/.test(cypherTag); // Alphanumeric, underscores, 3-15 chars
};

// Validate password strength
const validatePassword = (password) => {
  return password.length >= 6; // Require a minimum length of 6
};

// Validate UUID (e.g., for user or conversation IDs)
const validateUUID = (uuid) => {
  return /^[0-9a-fA-F]{24}$/.test(uuid); // Assumes MongoDB ObjectId format
};

module.exports = {
  validateCypherTag,
  validatePassword,
  validateUUID,
};
