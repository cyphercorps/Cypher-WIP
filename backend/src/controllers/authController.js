const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

// Firebase auth reference
const auth = admin.auth();

// Helper function to generate tokens
const generateTokens = (uid, cypherTag) => {
  // Generate access token (expires in 1 hour)
  const accessToken = jwt.sign({ uid, cypherTag }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Generate refresh token (expires in 7 days)
  const refreshToken = jwt.sign({ uid, cypherTag }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

// User Registration (Regular User)
exports.register = async (req, res, next) => {
  const { cypherTag, password, pin } = req.body;

  try {
    const email = `${cypherTag}@cypher.com`;
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: cypherTag
    });

    const hashedPin = await bcrypt.hash(pin, 10);
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      cypherTag,
      role: 'user',
      pin: hashedPin,
      createdAt: new Date(),
      updatedAt: new Date(),
      onlineStatus: true,
      freeChannels: 0,
      freeGroups: 0,
      ownedChannels: 0,
      ownedGroups: 0,
    });

    res.status(201).json({ message: 'User registered successfully', uid: userRecord.uid });
  } catch (error) {
    next(ApiError.internal('Error registering user', error.message));
  }
};

// Employee Registration (Cypher Admins)
exports.registerEmployee = async (req, res, next) => {
  const { cypherTag, password, pin, cypherEncryptionOrigin } = req.body;

  if (cypherEncryptionOrigin !== 'AB62D') {
    return next(ApiError.badRequest('Invalid Cypher Encryption Origin'));
  }

  try {
    const email = `${cypherTag}@cypher.com`;
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${cypherTag}🔒`,
    });

    const hashedPin = await bcrypt.hash(pin, 10);
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      cypherTag,
      role: 'employee',
      pin: hashedPin,
      cypherEncryptionOrigin,
      createdAt: new Date(),
      updatedAt: new Date(),
      onlineStatus: true,
      freeChannels: 0,
      freeGroups: 0,
      ownedChannels: 0,
      ownedGroups: 0,
    });

    res.status(201).json({ message: 'Employee registered successfully', uid: userRecord.uid });
  } catch (error) {
    next(ApiError.internal('Error registering employee', error.message));
  }
};

// User Login (Step 1: CypherTag/Password)
exports.login = async (req, res, next) => {
  const { cypherTag, password, cypherEncryptionOrigin } = req.body;

  try {
    const email = `${cypherTag}@cypher.com`;
    const userRecord = await auth.getUserByEmail(email);
    const userDoc = await admin.firestore().collection('users').doc(userRecord.uid).get();

    if (!userDoc.exists) {
      return next(ApiError.notFound('User not found'));
    }

    const user = userDoc.data();
    if (user.role === 'employee' && cypherEncryptionOrigin !== 'AB62D') {
      return next(ApiError.badRequest('Invalid Cypher Encryption Origin'));
    }

    // Proceed to the next step (PIN verification)
    res.status(200).json({ message: 'Login successful, please verify your PIN' });
  } catch (error) {
    next(ApiError.unauthorized('Authentication failed', error.message));
  }
};

// PIN Verification (Step 2) + Token Generation
exports.verifyPin = async (req, res, next) => {
  const { uid, pin } = req.body;

  try {
    const userDoc = await admin.firestore().collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return next(ApiError.notFound('User not found'));
    }

    const user = userDoc.data();
    const pinMatch = await bcrypt.compare(pin, user.pin);
    if (!pinMatch) {
      return next(ApiError.unauthorized('Incorrect PIN'));
    }

    // Generate tokens (access and refresh tokens)
    const { accessToken, refreshToken } = generateTokens(uid, user.cypherTag);

    // Store the refresh token in Firestore
    await admin.firestore().collection('users').doc(uid).update({
      refreshToken,
      tokenCreatedAt: new Date(),
      onlineStatus: true,
    });

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    next(ApiError.internal('PIN verification failed', error.message));
  }
};

// Refresh Access Token
exports.refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(ApiError.unauthorized('No refresh token provided.'));
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userDoc = await admin.firestore().collection('users').doc(decoded.uid).get();

    if (!userDoc.exists) {
      return next(ApiError.notFound('User not found'));
    }

    const user = userDoc.data();

    // Check if the refresh token matches the one stored in Firestore
    if (refreshToken !== user.refreshToken) {
      return next(ApiError.unauthorized('Invalid refresh token.'));
    }

    // Generate a new access token
    const accessToken = jwt.sign({ uid: user.uid, cypherTag: user.cypherTag }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ accessToken });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Refresh token expired. Please log in again.'));
    } else {
      next(ApiError.unauthorized('Failed to refresh token', error.message));
    }
  }
};

// Password Reset Function
exports.resetPassword = async (req, res, next) => {
  const { uid, pin, newPassword } = req.body;

  try {
    const userDoc = await admin.firestore().collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return next(ApiError.notFound('User not found'));
    }

    const user = userDoc.data();
    const pinMatch = await bcrypt.compare(pin, user.pin);
    if (!pinMatch) {
      return next(ApiError.unauthorized('Incorrect PIN'));
    }

    await auth.updateUser(uid, { password: newPassword });

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    next(ApiError.internal('Password reset failed', error.message));
  }
};

// Logout Function
exports.logout = async (req, res, next) => {
  const { uid } = req.body;

  try {
    // Invalidate both the access token and the refresh token
    await admin.firestore().collection('users').doc(uid).update({
      token: null,
      refreshToken: null,
      tokenCreatedAt: null,
      onlineStatus: false,
    });

    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    next(ApiError.internal('Failed to log out', error.message));
  }
};
