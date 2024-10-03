// models/UserSession.js

// Firestore Structure for User Sessions
const userSessionSchema = {
  userId: "unique-user-id",            // Firebase Auth UID for the user
  token: "jwt-token",                  // JWT token for the user session
  tokenCreatedAt: new Date(),          // Timestamp of when the token was created
  onlineStatus: true,                   // User's online status
  expiresAt: new Date(),                // Expiration date of the token (calculated)
};

module.exports = userSessionSchema;

// Example of a User Session in Firestore
const userSessionExample = {
  userId: "user1-uid",
  token: "example-jwt-token",
  tokenCreatedAt: "2024-01-01T12:00:00Z",
  onlineStatus: true,
  expiresAt: "2024-01-01T13:00:00Z", // This would be set to the token's expiration time
};
