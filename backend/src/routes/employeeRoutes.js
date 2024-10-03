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

// Admin: Delete user by UID (protected route)
router.delete('/delete-user/:uid', isAuthenticated, isSessionValid, isEmployee, deleteUser);

// Admin: Grant free access to channels and group chats (protected route)
router.post('/grant-free-access', isAuthenticated, isSessionValid, isEmployee, grantFreeAccess);

// Admin: Get platform statistics (total users, total messages, total conversations) (protected route)
router.get('/platform-stats', isAuthenticated, isSessionValid, isEmployee, getPlatformStats);

// Admin: Upload a conversation profile photo (protected route)
router.post('/conversation/:conversationId/upload-photo', isAuthenticated, isSessionValid, isEmployee, upload.single('profilePhoto'), setConversationProfilePhoto);

// Admin: Pin a message in a conversation (protected route)
router.post('/conversation/pin-message', isAuthenticated, isSessionValid, isEmployee, pinMessage);

// Admin: Rename a conversation (protected route)
router.post('/conversation/rename', isAuthenticated, isSessionValid, isEmployee, renameConversation);

module.exports = router;
