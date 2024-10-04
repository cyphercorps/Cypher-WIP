![CYPHER TRANSPARENT](https://github.com/user-attachments/assets/7f15a7e1-a210-4867-aab6-fe16b25f08b4)

# Cypher Project - Work In Progress (WIP)

Welcome to the **Cypher** project! Cypher is a non-KYC, privacy-centric messaging platform designed to provide end-to-end encrypted (E2EE) communication, focusing on security, anonymity, and ease of use. This Work In Progress (WIP) README will guide you through the various aspects of the project as it is being developed.

## Table of Contents
- [Overview](#overview)
- [Project Components](#project-components)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Backend Overview](#backend-overview)
- [Frontend Overview](#frontend-overview)
- [CLI Overview](#cli-overview)
- [Integration Suggestions](#integration-suggestions)
- [Future Enhancements](#future-enhancements)

## Overview
Cypher aims to deliver a secure messaging experience without requiring personal information or compromising privacy. By leveraging encryption technologies and modern web tools, Cypher ensures that user data remains confidential while providing a seamless messaging platform.

Key functionalities include:
- **Non-KYC Registration**: Users can create accounts with just a unique CypherTag and password, maintaining complete anonymity.
- **End-to-End Encrypted Messaging**: Messages are protected by AES and E2EE encryption, ensuring no one else can read them.
- **Group and Channel Messaging**: Users can create public and private group chats and channels, with paid options available for business and extended use.
- **Self-Destructing Messages**: Users can set messages to self-destruct, enhancing privacy and minimizing data storage.
- **Real-Time Communication**: Leverages Firebase Realtime Database for seamless real-time messaging.

## Project Components
The Cypher project comprises the following components:
1. **Backend**: A Node.js/Express server that provides APIs for authentication, messaging, user management, and payment verification.
2. **Frontend**: A React-based interface built using Next.js for a modern user experience.
3. **CLI**: Command Line Interface for admin functionalities, allowing the management of users, conversations, and other administrative tasks.

## Technology Stack
- **Node.js & Express** for backend services.
- **Firebase** for authentication, Firestore for data storage, and Realtime Database for real-time messaging.
- **React & Next.js** for frontend development.
- **Winston** for logging and **Rate Limiting** for API protection.
- **AES & E2EE Encryption** for secure messaging.
- **Web3.js** for cryptocurrency payment handling.

## Directory Structure
```
Cypher/
  |-- backend/
  |    |-- src/                # Source files for backend API and services
  |    |-- backend_cli/        # CLI for admin functionalities
  |    |-- index.js            # Entry point for backend server
  |-- frontend/
  |    |-- pages/              # Next.js pages for the application
  |    |-- components/         # React components used across the application
  |    |-- public/             # Public assets like images and icons
  |    |-- App.js              # Main app component
  |-- .env                     # Environment variables for both backend and frontend
  |-- README.md                # Project overview and setup instructions
```

## Features
- **User Authentication**: Secure user login and registration via Firebase, using CypherTag, password, and PIN verification.
- **Messaging**: Secure messaging with AES and E2EE, with options for direct messages, group chats, and channels.
- **Self-Destructing Messages**: Support for messages that delete after a predefined period.
- **Admin Features**: Employee admins can manage users, assign roles, view platform stats, and pin messages.
- **Crypto Payments**: ETH-based payments for unlocking advanced features such as creating business channels.
- **Minimalist UI**: Black-and-white themed interface focused on privacy, built for ease of navigation.

## Setup Instructions
1. **Clone the Repository**
   ```sh
   git clone <repository-url>
   cd Cypher/
   ```
2. **Backend Setup**
   - Navigate to the backend directory:
     ```sh
     cd backend/
     ```
   - Install dependencies:
     ```sh
     npm install
     ```
   - Set up your `.env` file with the necessary Firebase and server configuration details.
   - Start the backend server:
     ```sh
     node index.js combined
     ```
3. **Frontend Setup**
   - Navigate to the frontend directory:
     ```sh
     cd ../frontend/
     ```
   - Install dependencies:
     ```sh
     npm install
     ```
   - Start the development server:
     ```sh
     npm run dev
     ```
4. **Admin CLI**
   - The admin CLI can be started separately for managing backend functionalities:
     ```sh
     node backend/index.js cli
     ```

## Backend Overview
The backend handles all essential functions, including user authentication, encryption, and real-time message exchange. Firebase is used for its authentication capabilities, Realtime Database for fast message updates, and Firestore for persistent data.

**Key Endpoints** include:
- **/api/auth**: Handles user registration, login, and authentication.
- **/api/conversations**: APIs for creating, deleting, and managing conversations.
- **/api/messages**: Sending, deleting, and retrieving messages.

## Frontend Overview
The frontend uses **Next.js** to create a single-page experience for users, ensuring quick navigation between the dashboard, chat, and settings. Key components include:
- **Login & Registration**: Two-step process with password and PIN verification.
- **Dashboard**: Displays recent conversations and allows users to navigate between chats.
- **Messaging UI**: Chat interface that supports both text and media messages.

**Integration Suggestions**:
- Use Axios to communicate with the backend.
- JWT tokens should be stored securely (HTTP-only cookies or secure local storage).
- Implement Firebase listeners in the frontend to receive real-time updates from the Realtime Database.

## CLI Overview
The **Cypher CLI** allows admin employees to manage user accounts, retrieve platform statistics, and moderate conversations. It’s a powerful tool to execute administrative operations directly.

**Main Features**:
- **User Management**: Delete accounts, grant free channel creation.
- **Platform Stats**: View total user count, messages, and conversations.
- **Moderation Tools**: Pin messages, rename conversations.

To run the CLI:
```sh
node backend/index.js cli
```

## Future Enhancements
The following features are planned for future versions of Cypher:
- **Mobile Application**: Native Android/iOS apps for better user experience.
- **Voice and Video Calling**: Encrypted audio and video communication.
- **Advanced Payment Integrations**: Adding support for more cryptocurrencies.
- **User Privacy Analytics**: Tools to allow users to analyze and control their data footprint.

## Conclusion
The Cypher project is an ongoing effort to deliver privacy-focused, encrypted messaging with ease of use for both end-users and administrators. Contributions are welcome as we build this open and transparent communication platform.

For more details on how to get started or to contribute, please refer to the documentation or reach out to the maintainers.



