console.log('Initializing Firebase Admin SDK...');
const admin = require('firebase-admin');

// Firebase Admin configuration using environment variables
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),  // Fix newlines in private key
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL
};

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,  // Realtime Database URL
  });
  console.log('Firebase Admin SDK initialized successfully.');
} else {
  console.log('Firebase Admin SDK already initialized.');
}

// Use Firestore for conversations, users, etc.
const firestore = admin.firestore();

// Use Realtime Database for real-time features like messaging
const realtimeDatabase = admin.database();

module.exports = { admin, firestore, realtimeDatabase };
