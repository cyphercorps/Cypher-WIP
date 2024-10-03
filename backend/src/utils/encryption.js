const crypto = require('crypto');

// AES Encryption
const encryptMessage = (message, secretKey) => {
  const cipher = crypto.createCipher('aes-256-cbc', secretKey);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

// AES Decryption
const decryptMessage = (encryptedMessage, secretKey) => {
  const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
  let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

module.exports = { encryptMessage, decryptMessage };

// Example Usage:
// const secretKey = process.env.MESSAGE_SECRET_KEY;
// const encrypted = encryptMessage('Hello', secretKey);
// const decrypted = decryptMessage(encrypted, secretKey);
