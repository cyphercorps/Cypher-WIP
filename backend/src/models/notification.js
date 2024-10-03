// Firestore Structure for Notifications
const notificationSchema = {
  recipientId: "recipient-user-id",    // Firebase Auth UID for the recipient
  senderId: "sender-user-id",          // Firebase Auth UID for the sender
  title: "Notification Title",         // Title of the notification
  message: "Notification message",     // Notification message content
  read: false,                         // Whether the notification has been read
  createdAt: new Date()                // Timestamp of when the notification was created
};

module.exports = notificationSchema;

// Example of a Notification in Firestore
const notificationExample = {
  recipientId: "user1-uid",            // The user receiving the notification
  senderId: "user2-uid",               // The user who triggered the notification
  title: "New Message",
  message: "You have received a message from user2",
  read: false,
  createdAt: "2024-01-01T12:00:00Z"
};
