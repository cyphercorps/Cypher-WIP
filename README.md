---![CYPHER TRANSPARENT](https://github.com/user-attachments/assets/8c84f63d-711c-4e3b-889d-608922d7467c)

---

# Cypher Backend

Welcome to the backend of Cypher, a non-KYC messaging web app using AES encryption and E2EE (End-to-End Encryption) to ensure privacy and secure communication. This backend handles user authentication, conversations, real-time messaging, payments, notifications, and more.

## Project Overview

Cypher backend is built with:
- **Node.js** as the runtime environment.
- **Express** as the web framework.
- **Firebase** for Firestore (database), Firebase Realtime Database (real-time messaging), and Firebase Admin SDK for user management.
- **JWT** for token-based authentication.
- **AES encryption** for securing messages.
- **Log Rotation** for logging utilities.
- **Rate Limiting** for API protection.
- **Background scheduling** for self-destructing messages.

### Key Features:
- **User and Employee Authentication**: Secure login and registration with PIN verification.
- **Real-time Messaging**: Firebase Realtime Database for real-time message synchronization.
- **Self-destructing Messages**: Messages are deleted after a set period.
- **Conversation Management**: Create, delete, and manage conversations and participants.
- **Notifications**: Push notifications and real-time alerts for user interactions.
- **Crypto Payments**: Verify payments for channels and groups using cryptocurrency.
- **Session Management**: Manage user sessions with token refresh logic and session expiration.
- **Rate Limiting**: Protects against abuse with request limits.
- **Log Rotation**: Logs important events and errors with rotation for manageable logs.



## Table of Contents

- [Setup Instructions](#setup-instructions)
- [File Structure](#file-structure)
- [Environment Variables](#environment-variables)
- [Endpoints](#endpoints)
- [Testing Instructions](#testing-instructions)
- [Front-End Development](#front-end-development)
- [Security and Authentication](#security-and-authentication)
- [License](#license)

---

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/cypher-backend.git
   cd cypher-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables in the `.env` file (refer to the [Environment Variables](#environment-variables) section).

4. Start the server:

   ```bash
   npm start
   ```

5. Access the app at:

   ```
   http://localhost:5000
   ```

---

## File Structure

```
backend/
├── node_modules/
├── src/
│   ├── controllers/         # Route handler logic (auth, conversations, messages, notifications)
│   ├── middleware/          # Auth, session, token validation, and rate limiting
│   ├── models/              # Firestore document models (Conversation.js, Message.js, etc.)
│   ├── routes/              # Express.js route files (authRoutes.js, messageRoutes.js, etc.)
│   ├── utils/               # Utility files (ApiError.js, encryption.js, logger.js, etc.)
│   ├── firebase.js          # Firebase Admin initialization
│   ├── scheduler.js         # Background scheduling for message cleanup
│   └── errorMiddleware.js   # Global error handling middleware
├── index.js                 # Entry point of the Express server
├── package.json             # Node.js dependencies and project scripts
├── package-lock.json        # Locked versions of installed dependencies
└── .env                     # Environment variables (not included for security)
```

---

## Environment Variables

Make sure to configure the following environment variables in your `.env` file:

```bash
PORT=5000

# Firebase Admin SDK configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com

# JWT Secret for authentication
JWT_SECRET=your-jwt-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
```

---

## Endpoints

### Authentication and Sessions
- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/register-employee`: Register a new employee (Cypher admin).
- **POST** `/api/auth/login`: Start login with CypherTag and password.
- **POST** `/api/auth/verify-pin`: Complete login by verifying the user's PIN and generate tokens.
- **POST** `/api/auth/refresh-token`: Generate a new access token using a refresh token.
- **POST** `/api/auth/logout`: Log out and invalidate the user's session.

### Conversations
- **POST** `/api/conversations/create`: Create a new conversation (direct, group, or channel).
- **POST** `/api/conversations/delete`: Delete a conversation.
- **POST** `/api/conversations/add-participants`: Add participants to a group.
- **POST** `/api/conversations/remove-participants`: Remove participants from a group.

### Messaging
- **POST** `/api/messages/send`: Send a message in a conversation.
- **POST** `/api/messages/upload-image`: Upload and send an image.
- **POST** `/api/messages/delete`: Soft delete a message in a conversation.

### Notifications
- **POST** `/api/notifications/send`: Send a notification to a user.
- **GET** `/api/notifications/:uid`: Get all notifications for a user.

---

## Testing Instructions

To test the backend, you can use **Postman** or **cURL** to interact with the API. Below are example cURL commands to test the API functionality:

### User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"cypherTag":"testuser", "password":"password123", "pin":"123456"}'
```

### User Login (Step 1: CypherTag and Password)
```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"cypherTag":"testuser", "password":"password123"}'
```

### PIN Verification (Step 2) and Token Generation
```bash
curl -X POST http://localhost:5000/api/auth/verify-pin \
-H "Content-Type: application/json" \
-d '{"uid":"user_uid_here", "pin":"123456"}'
```

### Create Conversation
```bash
curl -X POST http://localhost:5000/api/conversations/create \
-H "Authorization: Bearer your_access_token" \
-H "Content-Type: application/json" \
-d '{"userId":"user_id_here", "participants":["other_user_id"], "type":"direct"}'
```

### Send a Message
```bash
curl -X POST http://localhost:5000/api/messages/send \
-H "Authorization: Bearer your_access_token" \
-H "Content-Type: application/json" \
-d '{"conversationId":"conversation_id_here", "senderId":"your_user_id", "message":"Hello"}'
```

---

## Front-End Development

The front-end of Cypher will be built using **Next.js**. This section provides a brief overview of how the front end should look and interact with the backend.

### UI Design Brief

1. **Login & Registration:**
   - Two-step login process (CypherTag and Password in the first step, PIN in the second).
   - The registration process should capture the CypherTag, password, and 6-digit PIN.

2. **Dashboard:**
   - A minimalist black and white theme.
   - A sidebar displaying the list of recent conversations.
   - A search bar for finding conversations or users by CypherTag.

3. **Messaging Screen:**
   - Two windows: left for the list of conversations, right for the chat window.
   - Input field at the bottom of the chat window for sending text and uploading images.
   - Self-destructing messages should visually indicate expiration.

4. **Notifications:**
   - Real-time notifications for new messages, participants added to conversations, and other user interactions.

### Front-End Suggestions:

- **State Management:** Consider using **Redux** or **React Context** to manage global state across the app, especially for authentication, conversations, and messages.
- **Real-time Updates:** Leverage **Firebase Realtime Database** for real-time updates to messages and notifications.
- **Styling:** Use **Tailwind CSS** or **Styled Components** to quickly implement and manage styles while keeping the design responsive.
- **Error Handling:** Implement user-friendly error messages for authentication failures, rate limits, or other API errors.
- **Session Management:** Refresh tokens should be handled in the background to ensure the user remains logged in without interruptions.

---

## Security and Authentication

- **JWT** tokens are used to authenticate users. Both access and refresh tokens are issued.
- **PIN Verification** ensures an extra layer of security during login.
- **Rate Limiting** is applied globally to prevent abuse and mitigate potential DoS attacks.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Signature

**MajinGenie**  
_Head of Cypher_

_"In the labyrinth of shadows, where anonymity thrives,  
Cypher is the beacon where secrets survive."_

---
