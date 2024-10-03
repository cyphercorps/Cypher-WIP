const rateLimit = require('express-rate-limit');

// Define the rate limit for general API requests
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  headers: true,
});

// Define a more aggressive rate limit for certain routes (e.g., login)
const authRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for login-related routes
  message: 'Too many login attempts, please try again after 10 minutes.',
  headers: true,
});

module.exports = {
  apiRateLimiter,
  authRateLimiter,
};
