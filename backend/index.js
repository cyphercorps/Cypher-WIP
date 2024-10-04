const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit'); // Import rate limiting middleware
const logger = require('./src/utils/logger'); // Import the logger
require('dotenv').config();

// Initialize Firebase Admin (import Firebase Admin early)
require('./src/firebase');

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const conversationRoutes = require('./src/routes/conversationRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const messageCleanup = require('./src/utils/messageCleanup'); // Import message cleanup script

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Enable trust proxy to handle X-Forwarded-For header correctly
app.set('trust proxy', 1);  // Trust the first proxy in front of your app

// Global Rate Limiter (Apply to all routes)
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(apiRateLimiter); // Apply the rate limiter globally

// Root route for testing the server
app.get('/', (req, res) => {
  res.send('Cypher Backend is running!');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500; // Default to 500 if not specified
  const errorMessage = err.message || 'Internal Server Error';

  // Log the error using the logger
  logger.error(`${statusCode} - ${errorMessage} - ${req.method} ${req.originalUrl} - ${req.ip}`);

  // Respond to the client
  res.status(statusCode).json({
    status: 'error',
    message: errorMessage,
  });
});

// Message Cleanup: Schedule cleanup of self-destructing messages
setInterval(() => {
  messageCleanup.cleanupSelfDestructingMessages();
}, 60 * 60 * 1000); // Run cleanup every hour

// Start Server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
