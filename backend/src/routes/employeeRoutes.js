const express = require('express');
const { 
  deleteUser, 
  grantFreeAccess, 
  getPlatformStats, 
  setConversationProfilePhoto, 
  pinMessage, 
  renameConversation 
} = require('../controllers/employeeController');
const { isAuthenticated, isEmployee } = require('../middleware/authMiddleware');
const { isSessionValid } = require('../middleware/sessionMiddleware'); // Include session middleware
const multer = require('multer');
const router = express.Router();

// Configure Multer to handle file uploads for profile photo uploads
const upload = multer({ storage: multer.memoryStorage() });

// Debug: Log imported handlers to verify they are defined
console.log({
  deleteUser,
  grantFreeAccess,
  getPlatformStats,
  setConversationProfilePhoto,
  pinMessage,
  renameConversation,
});

// Helper function to check if a handler is defined
const checkHandler = (handler, handlerName) => {
  if (!handler) {
    console.error(`Handler "${handlerName}" is not defined. Please check the employeeController.`);
  }
};

// Verify that all handlers are defined before using them in routes
checkHandler(deleteUser, 'deleteUser');
checkHandler(grantFreeAccess, 'grantFreeAccess');
checkHandler(getPlatformStats, 'getPlatformStats');
checkHandler(setConversationProfilePhoto, 'setConversationProfilePhoto');
checkHandler(pinMessage, 'pinMessage');
checkHandler(renameConversation, 'renameConversation');

// Admin: Delete user by UID (protected route)
if (deleteUser) {
  router.delete('/delete-user/:uid', isAuthenticated, isSessionValid, isEmployee, deleteUser);
}

// Admin: Grant free access to channels and group chats (protected route)
if (grantFreeAccess) {
  router.post('/grant-free-access', isAuthenticated, isSessionValid, isEmployee, grantFreeAccess);
}

// Admin: Get platform statistics (total users, total messages, total conversations) (protected route)
if (getPlatformStats) {
  router.get('/platform-stats', isAuthenticated, isSessionValid, isEmployee, getPlatformStats);
}

// Admin: Upload a conversation profile photo (protected route)
if (setConversationProfilePhoto) {
  router.post('/conversation/:conversationId/upload-photo', isAuthenticated, isSessionValid, isEmployee, upload.single('profilePhoto'), setConversationProfilePhoto);
}

// Admin: Pin a message in a conversation (protected route)
if (pinMessage) {
  router.post('/conversation/pin-message', isAuthenticated, isSessionValid, isEmployee, pinMessage);
}

// Admin: Rename a conversation (protected route)
if (renameConversation) {
  router.post('/conversation/rename', isAuthenticated, isSessionValid, isEmployee, renameConversation);
}

module.exports = router;
