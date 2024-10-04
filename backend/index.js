// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit'); // Import rate limiting middleware
const { logger, logCLIError } = require('./src/utils/logger'); // Import the logger
const messageCleanup = require('./src/utils/messageCleanup'); // Import message cleanup script
require('dotenv').config();
const path = require('path'); // Import the path module
const fs = require('fs'); // Import the fs module
const cliArgs = process.argv.slice(2);

// Initialize Firebase Admin (import Firebase Admin early)
require('./src/firebase');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Enable trust proxy to handle X-Forwarded-For header correctly
app.set('trust proxy', 1); // Trust the first proxy in front of your app

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

// Combined Backend + CLI Status Route
app.get('/backend-cli-status', (req, res) => {
  res.send('Cypher Backend + CLI v0.2 is running. O_o');
});

// Function to dynamically load all route files from the routes directory
const loadRoutes = () => {
  const routesPath = path.join(__dirname, 'src', 'routes');
  fs.readdirSync(routesPath).forEach((file) => {
    if (file.endsWith('.js')) {
      const route = require(path.join(routesPath, file));
      const routePath = `/api/${file.replace('.js', '')}`;
      app.use(routePath, route);
      logger.info(`Loaded route: ${routePath}`);
    }
  });
};

// Load all routes dynamically
loadRoutes();

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

// Function to start the CLI in the current shell
const startCLI = () => {
  try {
    const cypherCLI = require('./backend_cli/cypherCLI');
    cypherCLI.mainMenu().catch((cliError) => {
      // Catch any errors thrown by the CLI and print them to the console
      console.error('An error occurred while running the CLI:', cliError.message);
      logCLIError('An error occurred while running the CLI', cliError);
    });
  } catch (cliError) {
    console.error('An error occurred while running the CLI:', cliError.message);
    logCLIError('An error occurred while running the CLI', cliError);
  }
};

// Command-line arguments to determine what to run
if (cliArgs.includes('cli')) {
  // Initialize the CLI instead of the server
  startCLI();
} else if (cliArgs.includes('combined')) {
  // Run both CLI and backend server simultaneously

  // Start Server
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} alongside CLI`);
    console.log(`Server running on port ${PORT} alongside CLI`);
  });

  // Run the CLI in the current terminal
  startCLI();
} else {
  // Start Server
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    console.log(`Server running on port ${PORT}`);
  });
}
