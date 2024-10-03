const express = require('express');
const { getProfile, updateProfile, uploadProfilePhoto, searchUsers } = require('../controllers/profileController');
const { isAuthenticated } = require('../middleware/authMiddleware');  // Authentication middleware
const { isSessionValid } = require('../middleware/sessionMiddleware');  // Session validation middleware
const multer = require('multer');
const router = express.Router();

// Configure Multer to store file in memory
const upload = multer({ storage: multer.memoryStorage() });

// Profile routes

// Fetch profile by user ID (Protected by authentication and session validation)
router.get('/:uid', isAuthenticated, isSessionValid, getProfile);

// Update profile by user ID (Protected by authentication and session validation)
router.put('/:uid', isAuthenticated, isSessionValid, updateProfile);

// Upload profile photo (Protected by authentication and session validation)
router.post('/upload-photo', isAuthenticated, isSessionValid, upload.single('profilePhoto'), uploadProfilePhoto);

// Incremental search of users by CypherTag (Protected by authentication and session validation)
router.get('/search', isAuthenticated, isSessionValid, searchUsers);

module.exports = router;
