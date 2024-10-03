const express = require('express');
const { sendNotification, getUserNotifications, markAsRead } = require('../controllers/notificationController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { isSessionValid } = require('../middleware/sessionMiddleware');  // Session validation middleware
const router = express.Router();

// Send notification to a user (protected by authentication and session validation)
router.post('/send', isAuthenticated, isSessionValid, sendNotification);

// Get all notifications for a user (protected by authentication and session validation)
router.get('/:uid', isAuthenticated, isSessionValid, getUserNotifications);

// Mark a notification as read (protected by authentication and session validation)
router.put('/:uid/:notificationId/read', isAuthenticated, isSessionValid, markAsRead);

module.exports = router;
