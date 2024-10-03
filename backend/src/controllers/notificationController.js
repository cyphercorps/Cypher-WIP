const admin = require('firebase-admin');
const ApiError = require('../utils/ApiError');

// Send a notification to a user
exports.sendNotification = async (req, res, next) => {
  const { recipientId, title, message } = req.body;

  try {
    // Create notification document in Firestore
    const notification = {
      title,
      message,
      read: false,
      createdAt: new Date(),
    };

    await admin.firestore().collection('users').doc(recipientId).collection('notifications').add(notification);

    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Failed to send notification:', error);
    next(ApiError.internal('Failed to send notification', error.message));
  }
};

// Get all notifications for a user
exports.getUserNotifications = async (req, res, next) => {
  const { uid } = req.params;

  try {
    const notificationsSnapshot = await admin.firestore().collection('users').doc(uid).collection('notifications').get();
    const notifications = notificationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Failed to retrieve notifications:', error);
    next(ApiError.internal('Failed to retrieve notifications', error.message));
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res, next) => {
  const { uid, notificationId } = req.params;

  try {
    await admin.firestore().collection('users').doc(uid).collection('notifications').doc(notificationId).update({ read: true });
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    next(ApiError.internal('Failed to mark notification as read', error.message));
  }
};
