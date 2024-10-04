![CYPHER TRANSPARENT](https://github.com/user-attachments/assets/7f15a7e1-a210-4867-aab6-fe16b25f08b4)

# Cypher Backend

Welcome to the backend service of **Cypher**, a non-KYC, privacy-first messaging web app. This backend uses Firebase for authentication, data storage, and messaging, while Express.js powers the server API. The backend is responsible for authentication, user management, messaging, and various admin functionalities. Below, you will find detailed instructions to set up, run, and integrate this backend.

## Table of Contents

- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Firebase Setup](#firebase-setup)
- [Running the Backend](#running-the-backend)
- [API Documentation](#api-documentation)
- [Messaging Logic](#messaging-logic)
- [Admin Features](#admin-features)
- [Frontend Integration](#frontend-integration)
- [Security](#security)
- [Directory Structure](#directory-structure)
- [Logging](#logging)

## Project Overview

The Cypher backend is designed to support a highly secure, privacy-focused messaging application. Key features include:

- User registration and login via Firebase.
- AES and E2EE encryption for secure messaging.
- Admin capabilities for user management and platform statistics.
- API to manage conversations, messages, group chats, and channels.
- Minimalist design inspired by privacy-first principles.

## Prerequisites

Before setting up the backend, make sure you have the following installed:

- [Node.js (v18 or later)](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Firebase Admin SDK (as the backend depends on Firebase services)

## Getting Started

1. **Clone the Repository**
   ```sh
   git clone <repository-url>
   cd Cypher/backend
   ```
2. **Install Dependencies**
   ```sh
   npm install
   ```
3. **Set Up Environment Variables**
   Create a `.env` file at the root of your backend directory:
   ```sh
   touch .env
   ```
   Add the necessary environment variables (explained in the [Environment Configuration](#environment-configuration) section).

## Environment Configuration

Below is a sample `.env` configuration for the backend.

```env
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
JWT_SECRET=your_jwt_secret_key
MESSAGE_SECRET_KEY=your_message_encryption_key
REFRESH_TOKEN_SECRET=your_refresh_token_secret
PORT=5000
```

- **FIREBASE\_PROJECT\_ID**: Your Firebase project ID.
- **JWT\_SECRET**: The secret key used for signing JWT tokens.
- **MESSAGE\_SECRET\_KEY**: Secret key for message encryption.

## Firebase Setup

1. Create a Firebase project and add the service account.
2. Enable Firebase Auth, Firestore Database, and Firebase Realtime Database.
3. Download your service account key (JSON format) and place it in the `src` directory.
4. Update your `.env` with Firebase credentials.

## Running the Backend

To run the backend:

- **Run the server alone**
  ```sh
  node index.js
  ```
- **Run the backend with CLI for admin functionalities**
  ```sh
  node index.js combined
  ```
- The backend runs by default on port `5000`. You can modify the `PORT` in `.env`.

## API Documentation

The backend offers a series of RESTful APIs to interact with the Cypher application. These routes are dynamically loaded from the `src/routes` directory. Below is an overview:

- **Authentication** (`/api/auth`)

  - **POST /register**: Register a new user.
  - **POST /login**: Log in a user.
  - **POST /refresh-token**: Refresh an access token.

- **Messages** (`/api/messages`)

  - **POST /send**: Send a message within a conversation.
  - **GET /**: Get all messages in a specific conversation.

- **Conversations** (`/api/conversations`)

  - **POST /create**: Create a new conversation.
  - **POST /rename**: Rename a conversation.

- **Admin Operations** (`/api/employeeRoutes`)

  - **DELETE /delete-user/**: Delete a user by their UID.
  - **POST /grant-free-access**: Grant free group and channel creation permissions.
  - **GET /platform-stats**: Get platform statistics.

For full documentation of the available endpoints, refer to the `/docs` directory (if available).

## Messaging Logic

- Messages are end-to-end encrypted (E2EE) and stored within Firestore.
- Messages are organized within **conversations**, which are the basic units for both direct and group communication.
- **Channels** and **Group Chats** are treated as specialized types of conversations.
- Each message and conversation is indexed by a unique identifier for efficient retrieval.

## Admin Features

Admin employees have enhanced privileges for managing the platform. The admin CLI can:

- Delete user accounts.
- Assign roles such as **Employee Admin**.
- Retrieve platform statistics such as total users, messages, and conversations.
- Pin messages, rename conversations, and set profile photos for conversations.

To run the CLI standalone, execute:

```sh
node index.js cli
```

## Frontend Integration

To integrate a Next.js + React frontend with this backend, follow these steps:

1. **Set Up API Calls**
   - Use Axios or the native Fetch API to make HTTP requests to the backend.
   - Example for fetching messages:
     ```js
     import axios from 'axios';

     const getMessages = async (conversationId) => {
       try {
         const response = await axios.get(`/api/messages/${conversationId}`);
         return response.data;
       } catch (error) {
         console.error('Error fetching messages:', error);
       }
     };
     ```
2. **Authentication Flow**
   - After registering or logging in via Firebase, store the JWT in local storage or cookies.
   - Attach the JWT as an Authorization header to protected endpoints.
3. **Real-Time Updates**
   - Use WebSockets or Firebase Realtime Database to enable real-time message updates.
   - You can leverage Firebase's SDK for listening to changes in Firestore, triggering front-end updates.
4. **Routing**
   - Route different components in Next.js to backend endpoints. For example, use `getServerSideProps` to fetch conversation data server-side.
   - Secure route access by validating the JWT on each server-side request.

## Security

- **JWT Authentication**: Used for managing user sessions securely.
- **Rate Limiting**: Prevents abusive access to the API by limiting requests.
- **E2EE Messaging**: Ensures message privacy with AES encryption and Firebase.
- **Error Handling**: Comprehensive middleware catches and handles errors to provide secure responses.

## Directory Structure

```
backend/
  |-- src/
  |    |-- routes/                 # API routes
  |    |-- controllers/            # Request handlers
  |    |-- middleware/             # Authentication and session middleware
  |    |-- utils/                  # Utility functions (e.g., encryption, logging)
  |    |-- firebase.js             # Firebase Admin initialization
  |-- backend_cli/                 # CLI for admin functionalities
  |-- index.js                     # Entry point of the application
  |-- .env                         # Environment variables
  |-- package.json                 # Dependencies and scripts
```

## Logging

- Uses **Winston** for logging information and errors.
- Logs are saved in a rotating file system within the `logs/` directory.
- All access, errors, and CLI events are logged for auditing.

## Conclusion

The Cypher backend is built to ensure data privacy, scalability, and ease of integration with a React or Next.js frontend. Frontend developers can use the provided API endpoints to create a seamless and secure messaging experience.

For questions or issues, please reach out to the project maintainers or refer to the documentation.

