const express = require('express');
const {
  createConversation,
  getUserConversations,
  addParticipants,
  removeParticipants,
  setAdminPermissions, // Updated to allow setting specific admin permissions
  renameConversation,
  pinMessage,
  updateParticipantPermissions, // Added for updating participant permissions
  clearConversation,
  deleteConversation
} = require('../controllers/conversationController');
const { verifyAccessToken, refreshTokenIfNeeded } = require('../middleware/tokenMiddleware'); // Import token middleware
const { isAuthenticated } = require('../middleware/authMiddleware');  // Authentication middleware
const { isSessionValid } = require('../middleware/sessionMiddleware');  // Session validation middleware

const router = express.Router();

// Create a conversation (protected by authentication, session validation, and token verification)
router.post('/create', verifyAccessToken, refreshTokenIfNeeded, isAuthenticated, isSessionValid, createConversation);

// Get all conversations for a user (protected by authentication, session validation, and token verification)
router.get('/user/:uid', verifyAccessToken, refreshTokenIfNeeded, isAuthenticated, isSessionValid, getUserConversations);

// Add participants to a group chat (protected by authentication, session validation, and token verification)
router.post('/add-participants', verifyAccessToken, refreshTokenIfNeeded, isAuthenticated, isSessionValid, addParticipants);

// Remove participants from a group chat (protected by authentication, session validation, and token verification)
router.post('/remove-participants', verifyAccessToken, refreshTokenIfNeeded, isAuthenticated, isSessionValid, removeParticipants);

// Set specific admin permissions for a user (protected by authentication, session validation, and token verification)
router.post('/set-admin-permissions', verifyAccessToken, refreshTokenIfNeeded, isAuthenticated, isSessionValid, setAdminPermissions);

// Rename a conversation (protected by authentication, session validation, and token verification)
router.post('/rename', verifyAccessToken, refreshTokenIfNeeded, isAuthenticated, isSessionValid, renameConversation);

// Pin/Unpin a message (protected by authentication, session validation, and token verification)
router.post('/pin-message', verifyAccessToken, refreshTokenIfNeeded, isAuthenticated, isSessionValid, pinMessage);

// Update participant permissions (protected by authentication, session validation, and token verification)
router.post('/update-participant-permissions', verifyAccessToken, refreshTokenIfNeeded, isAuthenticated, isSessionValid, updateParticipantPermissions);

// Clear all messages in a conversation (protected by authentication, session validation, and token verification)
router.post('/clear-conversation', verifyAccessToken, refreshTokenIfNeeded, isAuthenticated, isSessionValid, clearConversation);

// Delete a conversation (protected by authentication, session validation, and token verification)
router.post('/delete-conversation', verifyAccessToken, refreshTokenIfNeeded, isAuthenticated, isSessionValid, deleteConversation);

module.exports = router;