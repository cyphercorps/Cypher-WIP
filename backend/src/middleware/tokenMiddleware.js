const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const ApiError = require('../utils/ApiError');

// Middleware to validate access token
exports.verifyAccessToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('No token provided'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token exists in Firestore and is still valid
    const userDoc = await admin.firestore().collection('users').doc(decoded.uid).get();
    if (!userDoc.exists) {
      return next(ApiError.unauthorized('User not found'));
    }

    const user = userDoc.data();
    if (!user.token || user.token !== token) {
      return next(ApiError.unauthorized('Invalid or expired token'));
    }

    // Attach user data to request for further processing
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Token expired'));
    }
    return next(ApiError.unauthorized('Invalid token'));
  }
};

// Middleware to refresh the token if it's close to expiration
exports.refreshTokenIfNeeded = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.decode(token);

    // Check if the token is expiring soon (e.g., within 10 minutes)
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    if (decoded.exp - currentTime < 600) { // 600 seconds = 10 minutes
      const userDoc = await admin.firestore().collection('users').doc(decoded.uid).get();
      if (!userDoc.exists) {
        return next(ApiError.unauthorized('User not found'));
      }

      const user = userDoc.data();
      if (!user.refreshToken) {
        return next(ApiError.unauthorized('No refresh token available'));
      }

      // Verify the refresh token and issue a new access token
      const refreshToken = user.refreshToken;
      const refreshDecoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      if (refreshDecoded.uid !== decoded.uid) {
        return next(ApiError.unauthorized('Invalid refresh token'));
      }

      // Generate a new access token
      const newAccessToken = jwt.sign({ uid: decoded.uid, cypherTag: user.cypherTag }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Return the new token to the client in the response
      res.setHeader('Authorization', `Bearer ${newAccessToken}`);
    }

    next();
  } catch (error) {
    return next(ApiError.unauthorized('Failed to refresh token', error.message));
  }
};
