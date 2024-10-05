// conversationRoutes.js

const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const permissionMiddleware = require('../middleware/permissionMiddleware');

// Route to create a new conversation
router.post('/create', conversationController.createConversation);

// Route to get all conversations for a user
router.get('/user/:uid', conversationController.getUserConversations);

// Route to add participants to a group chat (only allowed for admins or owner)
router.post(
  '/add-participants',
  permissionMiddleware('admin', 'addParticipants'),
  conversationController.addParticipants
);

// Route to remove participants from a group chat (only allowed for admins or owner)
router.post(
  '/remove-participants',
  permissionMiddleware('admin', 'removeParticipants'),
  conversationController.removeParticipants
);

// Route to delete a conversation (only allowed for the owner)
router.delete(
  '/delete',
  permissionMiddleware('owner', 'deleteConversation'),
  conversationController.deleteConversation
);

// Route to set a group admin (only allowed for the owner)
router.post(
  '/set-admin',
  permissionMiddleware('owner', 'setAdmin'),
  conversationController.setGroupAdmin
);

// Route to rename a conversation (only allowed for admins or owner)
router.patch(
  '/rename',
  permissionMiddleware('admin', 'renameConversation'),
  conversationController.renameConversation
);

// Route to pin or unpin a message (only allowed for admins or owner)
router.post(
  '/pin-message',
  permissionMiddleware('admin', 'pinMessages'),
  conversationController.pinMessage
);

// Route to clear all messages in a conversation (only allowed for the owner)
router.post(
  '/clear',
  permissionMiddleware('owner', 'clearMessages'),
  conversationController.clearConversation
);

// Route for a user to leave a conversation (allowed for participants)
router.post(
  '/leave',
  permissionMiddleware('participant', 'leaveConversation'),
  conversationController.leaveConversation
);

module.exports = router;