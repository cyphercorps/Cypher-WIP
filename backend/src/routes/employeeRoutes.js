const express = require('express');
const { 
  deleteUser, 
  grantFreeAccess, 
  getPlatformStats
} = require('../controllers/employeeController');
const { isAuthenticated, isEmployee } = require('../middleware/authMiddleware');
const { isSessionValid } = require('../middleware/sessionMiddleware'); // Include session middleware
const router = express.Router();

// Debug: Log imported handlers to verify they are defined
console.log({
  deleteUser,
  grantFreeAccess,
  getPlatformStats
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

module.exports = router;