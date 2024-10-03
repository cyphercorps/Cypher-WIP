const express = require('express');
const {
  register,
  registerEmployee,
  login,
  verifyPin,
  resetPassword,
  logout,
  refreshToken,
} = require('../controllers/authController');
const { verifyAccessToken, refreshTokenIfNeeded } = require('../middleware/tokenMiddleware'); // Import token middleware
const { isSessionValid } = require('../middleware/sessionMiddleware'); // Import session middleware

const router = express.Router();

// Register a new user
router.post('/register', register);

// Register a new employee (Cypher Admin)
router.post('/register-employee', registerEmployee);

// User login (Step 1: CypherTag/Password)
router.post('/login', login);

// PIN verification and token generation (Step 2)
router.post('/verify-pin', verifyPin);

// Refresh access token using refresh token
router.post('/refresh-token', refreshToken);

// Password reset using PIN
router.post('/reset-password', resetPassword);

// User logout (invalidate tokens)
router.post('/logout', verifyAccessToken, isSessionValid, logout); // Protected route: user must be logged in and session must be valid

// Example of a protected route (optional)
// You can apply token validation, session validation, and automatic token refresh middleware here
router.get('/protected', verifyAccessToken, isSessionValid, refreshTokenIfNeeded, (req, res) => {
  res.status(200).json({ message: 'You have access to this protected route!' });
});

module.exports = router;
