#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const axios = require('axios');
require('dotenv').config();

// Define CLI program
const program = new Command();

// Base URL for the backend API
const BASE_URL = process.env.BACKEND_URL || 'https://your-backend-url';

// Step 1: Prompt user for password before granting access
async function authenticate() {
  const { password } = await inquirer.prompt([
    {
      type: 'password',
      message: 'Enter password to access the Cypher CLI:',
      name: 'password',
      mask: '*',
    },
  ]);

  // Check if the password is correct
  if (password === 'AB62D') {
    console.log('Access granted. Welcome to Cypher CLI.');
    startCLI(); // Start the main CLI after successful authentication
  } else {
    console.error('Access denied. Incorrect password.');
    process.exit(1);
  }
}

// Step 2: Define CLI Commands
function startCLI() {
  program
    .name('cypherCLI')
    .description('CLI for managing and debugging the Cypher Backend')
    .version('1.0.0');

  // Test Connection
  program
    .command('test-connection')
    .description('Test the connection to the backend')
    .action(async () => {
      try {
        const response = await axios.get(`${BASE_URL}/`);
        console.log('Backend Response:', response.data);
      } catch (error) {
        console.error('Error connecting to backend:', error.message);
      }
    });

  // Register User
  program
    .command('register-user')
    .description('Register a new user')
    .requiredOption('-t, --cypherTag <cypherTag>', 'CypherTag of the user')
    .requiredOption('-p, --password <password>', 'Password for the user')
    .requiredOption('-n, --pin <pin>', '6-digit pin for the user')
    .action(async (options) => {
      try {
        const { cypherTag, password, pin } = options;
        const response = await axios.post(`${BASE_URL}/api/auth/register`, {
          cypherTag,
          password,
          pin,
        });
        console.log('User registered successfully:', response.data);
      } catch (error) {
        console.error('Error registering user:', error.response ? error.response.data : error.message);
      }
    });

  // Login User
  program
    .command('login')
    .description('Login a user')
    .requiredOption('-t, --cypherTag <cypherTag>', 'CypherTag of the user')
    .requiredOption('-p, --password <password>', 'Password for the user')
    .action(async (options) => {
      try {
        const { cypherTag, password } = options;
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
          cypherTag,
          password,
        });
        console.log('Login successful:', response.data);
      } catch (error) {
        console.error('Error logging in:', error.response ? error.response.data : error.message);
      }
    });

  // Send Message
  program
    .command('send-message')
    .description('Send a message to a conversation')
    .requiredOption('-c, --conversationId <conversationId>', 'Conversation ID')
    .requiredOption('-s, --senderId <senderId>', 'Sender ID')
    .requiredOption('-m, --message <message>', 'Message text')
    .action(async (options) => {
      try {
        const { conversationId, senderId, message } = options;
        const response = await axios.post(`${BASE_URL}/api/messages/send`, {
          conversationId,
          senderId,
          message,
        });
        console.log('Message sent successfully:', response.data);
      } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
      }
    });

  // Get Messages
  program
    .command('get-messages')
    .description('Get messages from a conversation')
    .requiredOption('-c, --conversationId <conversationId>', 'Conversation ID')
    .action(async (options) => {
      try {
        const { conversationId } = options;
        const response = await axios.get(`${BASE_URL}/api/messages/${conversationId}/messages`);
        console.log('Messages:', response.data);
      } catch (error) {
        console.error('Error getting messages:', error.response ? error.response.data : error.message);
      }
    });

  // Create Conversation
  program
    .command('create-conversation')
    .description('Create a new conversation')
    .requiredOption('-u, --userId <userId>', 'ID of the user creating the conversation')
    .requiredOption('-p, --participants <participants...>', 'List of participant IDs')
    .requiredOption('-t, --type <type>', 'Type of conversation (direct, group, channel)')
    .action(async (options) => {
      try {
        const { userId, participants, type } = options;
        const response = await axios.post(`${BASE_URL}/api/conversations/create`, {
          userId,
          participants,
          type,
        });
        console.log('Conversation created successfully:', response.data);
      } catch (error) {
        console.error('Error creating conversation:', error.response ? error.response.data : error.message);
      }
    });

  // Refresh Token
  program
    .command('refresh-token')
    .description('Refresh user access token')
    .requiredOption('-r, --refreshToken <refreshToken>', 'User refresh token')
    .action(async (options) => {
      try {
        const { refreshToken } = options;
        const response = await axios.post(`${BASE_URL}/api/auth/refresh-token`, {
          refreshToken,
        });
        console.log('Token refreshed successfully:', response.data);
      } catch (error) {
        console.error('Error refreshing token:', error.response ? error.response.data : error.message);
      }
    });

  // Logout User
  program
    .command('logout')
    .description('Logout a user')
    .requiredOption('-u, --uid <uid>', 'User ID')
    .action(async (options) => {
      try {
        const { uid } = options;
        const response = await axios.post(`${BASE_URL}/api/auth/logout`, {
          uid,
        });
        console.log('User logged out successfully:', response.data);
      } catch (error) {
        console.error('Error logging out:', error.response ? error.response.data : error.message);
      }
    });

  // Parse the CLI arguments
  program.parse(process.argv);
}

// Run the authentication prompt first
authenticate();
