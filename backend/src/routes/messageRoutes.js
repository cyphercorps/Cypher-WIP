const express = require('express');
const {
  sendMessage,
  getMessages,
  updateReadReceipts,
  uploadAndSendImage,
  typingIndicator,
  editMessage,  // Route for editing a message
  deleteMessage  // Route for deleting a message
} = require('../controllers/messageController');
const { isAuthenticated } = require('../middleware/authMiddleware');  // Authentication middleware
const { isSessionValid } = require('../middleware/sessionMiddleware');  // Session validation middleware
const multer = require('multer');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Send a message within a conversation (protected by authentication and session validation)
router.post('/send', isAuthenticated, isSessionValid, sendMessage);

// Get messages for a conversation (protected by authentication and session validation)
router.get('/:conversationId/messages', isAuthenticated, isSessionValid, getMessages);

// Update read receipts for a conversation (protected by authentication and session validation)
router.post('/update-read-receipts', isAuthenticated, isSessionValid, updateReadReceipts);

// Typing Indicator for a conversation (protected by authentication and session validation)
router.post('/typing', isAuthenticated, isSessionValid, typingIndicator);

// Upload and send an image in a conversation (protected by authentication and session validation)
router.post('/upload-image', isAuthenticated, isSessionValid, upload.single('image'), uploadAndSendImage);

// Edit a message within a conversation (protected by authentication and session validation)
router.post('/edit-message', isAuthenticated, isSessionValid, editMessage);

// Soft delete a message within a conversation (protected by authentication and session validation)
router.post('/delete-message', isAuthenticated, isSessionValid, deleteMessage);

module.exports = router;
