# Cypher CLI

Welcome to the **Cypher Command-Line Interface (CLI)**. The Cypher CLI is an administrative tool designed to facilitate backend management of the Cypher application. It provides Cypher employees and administrators with the ability to manage users, conversations, and platform-level operations efficiently from the command line.

## Table of Contents

- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
- [Available Commands](#available-commands)
- [Environment Setup](#environment-setup)
- [Authentication](#authentication)
- [Features](#features)
- [Logging](#logging)
- [Usage Tips](#usage-tips)

## Project Overview

The Cypher CLI is a Node.js application built to work alongside the Cypher backend. It allows administrators to:

- Register and manage users (including employee accounts).
- Grant special privileges (e.g., free channel and group creation).
- Manage conversations by renaming, deleting, or pinning messages.
- Retrieve platform-level statistics, such as total users and conversations.

## Getting Started

To get started with the Cypher CLI, follow these steps:

### Prerequisites

- **Node.js (v18 or later)**: Ensure that you have Node.js installed.
- **Cypher Backend**: The backend should be up and running since the CLI directly interacts with backend services.
- **Firebase Admin SDK**: The CLI relies on Firebase to manage user information.

### Installation

1. **Clone the Repository**

   ```sh
   git clone <repository-url>
   cd Cypher/backend
   ```

2. **Install Dependencies**

   ```sh
   npm install
   ```

3. **Run the CLI**

   ```sh
   node index.js cli
   ```

   Alternatively, you can run both the backend and CLI together:

   ```sh
   node index.js combined
   ```

## Available Commands

The CLI provides a categorized menu-driven interface to access different features. Below are the key commands:

### Authentication Commands

- **Register User**: Register a new user by providing their CypherTag and credentials.
- **Login User**: Login a user with their credentials.
- **Verify PIN**: Complete the login by verifying the user's 6-digit PIN.
- **Refresh Token**: Refresh an access token for an existing session.
- **Logout User**: Log out a user and invalidate their current session.

### Conversation Commands

- **Create Conversation**: Create a direct, group, or channel conversation.
- **Rename Conversation**: Change the name of an existing conversation.
- **Add Participants**: Add new users to a group conversation.
- **Delete Conversation**: Permanently remove a conversation.
- **Pin Message**: Pin an important message within a conversation.

### Employee/Admin Commands

- **Delete User**: Delete a user from the system.
- **Grant Free Access**: Grant free group or channel creation privileges.
- **Get Platform Stats**: Retrieve platform-wide statistics, such as total users, messages, and conversations.
- **Upload Profile Photo**: Upload a profile picture for a specific conversation.

### Messaging Commands

- **Send Message**: Send a message to a specific conversation.
- **Edit Message**: Edit a previously sent message.
- **Delete Message**: Soft delete a message from a conversation.
- **Upload and Send Image**: Upload and send an image within a conversation.
- **Update Read Receipts**: Update read receipts for messages.
- **Typing Indicator**: Send a typing indicator notification.

## Environment Setup

Ensure you have a `.env` file at the root of the backend directory with the necessary environment variables:

```env
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

The CLI reads these environment variables to connect to Firebase and manage user operations effectively.

## Authentication

Upon starting the CLI, administrators are prompted to enter an access password. This password is used to restrict access to sensitive administrative operations. Make sure the password is kept secure.

The password for accessing the CLI can be updated in the `cypherCLI.js` file:

```js
const PASSWORD = '*****'; // Contact CypherCorp for Passwd.
```

## Features

### Admin Privileges

The Cypher CLI allows admins to:

- Manage user accounts (e.g., delete users, assign privileges).
- Monitor platform statistics for informed decision-making.
- Pin and rename conversations to maintain order within the messaging ecosystem.

### Real-Time Interaction

The CLI interacts in real-time with Firebase services, allowing administrators to make updates and see the effect immediately within the application.

### Error Handling

If any issues occur while using the CLI, they will be logged, and informative messages will be displayed to the user. Logs are saved to provide an audit trail for every action taken.

## Logging

- All actions taken through the CLI are logged using **Winston**.
- Logs are saved in a rotating file system to ensure easy access and prevent excessive disk space usage.
- Logs can be viewed through the CLI using the **Show Log Files** or **View Specific Log File** commands.

## Usage Tips

- **Use Combined Mode for Convenience**: Running `node index.js combined` will launch both the server and the CLI, giving administrators full access to both functionalities in one terminal.
- **Environment-Specific Variables**: If running multiple instances (e.g., for testing and production), ensure you use separate environment files for each to prevent misconfigurations.
- **Accessing Logs**: To troubleshoot issues, access logs through the CLI or by navigating to the `logs/` directory.
- **Security First**: Always restrict access to the CLI to authorized personnel by keeping the CLI password secure and changing it periodically.

## Conclusion

The Cypher CLI is a powerful tool that extends the functionalities of the Cypher backend, giving administrators direct control over user and platform management. It is designed for ease of use and security, making it an essential part of managing the Cypher messaging ecosystem.

For further questions, consult the project documentation or contact CypherCorp.

