// Firestore Structure for User Profiles
const profileSchema = {
  userId: "unique-user-id",              // Firebase Auth UID for the user
  cypherTag: "user1",                    // Unique CypherTag chosen by the user
  email: "user1@cypher.com",             // Pseudo-email created from the CypherTag
  passwordHash: "hashed-password",       // Hashed password for security
  pinHash: "hashed-6-digit-pin",         // Hashed 6-digit PIN for additional security
  role: "user",                          // Role of the user ('user' or 'employee')
  bio: "User bio here",                  // User bio (optional)
  profilePhotoURL: "path/to/photo.png",  // Profile photo URL (Firebase Storage)
  notifications: true,                   // Notifications setting (on/off)
  privacySettings: {                     // Privacy settings (e.g., who can contact the user)
    showProfile: true,
    showOnlineStatus: false
  },
  freeChannels: 0,                       // Number of free channels available (admin-granted)
  freeGroups: 0,                         // Number of free group chats available (admin-granted)
  ownedChannels: 0,                      // Number of channels owned by the user
  ownedGroups: 0,                        // Number of groups owned by the user
  createdAt: new Date(),                 // Timestamp of when the user account was created
  updatedAt: new Date()                  // Timestamp of the last update to the profile
};

module.exports = profileSchema;

// Example of a User Profile in Firestore
const profileExample = {
  userId: "user1-uid",
  cypherTag: "user1",
  email: "user1@cypher.com",
  passwordHash: "hashed-password-example",
  pinHash: "hashed-pin-example",
  role: "employee",                      // 'employee' for Cypher employees, 'user' for regular users
  bio: "Hey, I'm user1!",
  profilePhotoURL: "https://example.com/path-to-photo.png",
  notifications: true,
  privacySettings: {
    showProfile: true,
    showOnlineStatus: false
  },
  freeChannels: 3,                       // Admin has granted 3 free channels
  freeGroups: 5,                         // Admin has granted 5 free group chats
  ownedChannels: 2,                      // Number of channels owned by the user
  ownedGroups: 1,                        // Number of groups owned by the user
  createdAt: "2024-01-01T12:00:00Z",
  updatedAt: "2024-01-01T12:30:00Z"
};

module.exports = profileExample;
