const express = require('express');
const {
  deleteUser,
  grantFreeAccess,
  getPlatformStats,
} = require('../controllers/employeeController');
const { isAuthenticated, isEmployee } = require('../middleware/authMiddleware');
const { isSessionValid } = require('../middleware/sessionMiddleware'); // Include session middleware
const router = express.Router();

// Admin: Delete user by UID (protected route)
router.delete('/delete-user/:uid', isAuthenticated, isSessionValid, isEmployee, deleteUser);

// Admin: Grant free access to channels and group chats (protected route)
router.post('/grant-free-access', isAuthenticated, isSessionValid, isEmployee, grantFreeAccess);

// Admin: Get platform statistics (total users, total messages, total conversations) (protected route)
router.get('/platform-stats', isAuthenticated, isSessionValid, isEmployee, getPlatformStats);

module.exports = router;