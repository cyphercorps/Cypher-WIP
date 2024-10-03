// Validate Password Strength (at least 6 characters)
const validatePassword = (password) => {
  return password.length >= 6;
};

// Validate CypherTag (only alphanumeric characters, length between 3 and 15)
const validateCypherTag = (cypherTag) => {
  const regex = /^[a-zA-Z0-9]{3,15}$/;
  return regex.test(cypherTag);
};

// Validate 6-Digit PIN (must be exactly 6 digits)
const validatePin = (pin) => {
  const regex = /^[0-9]{6}$/;
  return regex.test(pin);
};

module.exports = { validatePassword, validateCypherTag, validatePin };

// Example Usage:
// if (!validatePassword(password)) {
//   return res.status(400).json({ error: 'Password must be at least 6 characters' });
// }
// if (!validateCypherTag(cypherTag)) {
//   return res.status(400).json({ error: 'CypherTag must be alphanumeric and 3-15 characters long' });
// }
// if (!validatePin(pin)) {
//   return res.status(400).json({ error: 'PIN must be exactly 6 digits' });
