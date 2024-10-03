const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");

// Middleware to check if the user session is still valid (based on JWT token)
exports.isSessionValid = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1]; // Extract the token from Authorization header

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    // Decode the token using JWT
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user session from Firestore based on UID
    const userSessionDoc = await admin.firestore().collection('userSessions').doc(decodedToken.uid).get();

    if (!userSessionDoc.exists) {
      return res.status(401).json({ error: "Session not found. Please log in again." });
    }

    const userSession = userSessionDoc.data();

    // Check if the token in Firestore matches the token provided
    if (userSession.token !== token) {
      return res.status(401).json({ error: "Invalid session. Please log in again." });
    }

    // Check if the token has expired
    const now = new Date();
    const expiresAt = new Date(userSession.expiresAt);
    if (now > expiresAt) {
      // Update the user's onlineStatus to false in Firestore
      await admin.firestore().collection('users').doc(decodedToken.uid).update({
        onlineStatus: false
      });

      // Delete the expired session from Firestore
      await admin.firestore().collection('userSessions').doc(decodedToken.uid).delete();

      return res.status(401).json({ error: "Session expired. Please log in again." });
    }

    // Attach user information to the request object
    req.user = decodedToken;
    next(); // Proceed to the next middleware or route handler

  } catch (error) {
    console.error("Session validation error:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid session" });
  }
};

// Middleware to log out and invalidate the session
exports.logout = async (req, res) => {
  const token = req.headers.authorization?.split("Bearer ")[1]; // Extract the token from Authorization header

  if (!token) {
    return res.status(400).json({ error: "No token provided" });
  }

  try {
    // Decode the token using JWT
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Update the user's onlineStatus to false in Firestore
    await admin.firestore().collection('users').doc(decodedToken.uid).update({
      onlineStatus: false
    });

    // Delete the session from Firestore
    await admin.firestore().collection('userSessions').doc(decodedToken.uid).delete();

    res.status(200).json({ message: "Logged out successfully and session invalidated." });

  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Failed to log out and invalidate session" });
  }
};
