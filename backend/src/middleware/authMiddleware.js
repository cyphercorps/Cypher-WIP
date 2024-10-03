const admin = require("firebase-admin");
const jwt = require('jsonwebtoken');

// Middleware to check if the user is authenticated (via stored JWT token)
exports.isAuthenticated = async (req, res, next) => {
  // Extract token from the Authorization header
  const token = req.headers.authorization?.split("Bearer ")[1]; 

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    // Decode the token to get user ID
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken; // Attach the decoded token to the request object

    // Fetch user document from Firestore
    const userDoc = await admin.firestore().collection('users').doc(req.user.uid).get();

    // Ensure user document exists
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userDoc.data();

    // Verify the stored token matches the provided token
    if (user.token !== token) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // Update the token and token creation timestamp in Firestore
    await admin.firestore().collection('users').doc(req.user.uid).update({
      token: token,
      tokenCreatedAt: new Date(),
      onlineStatus: true // Set online status to true on authentication
    });

    next(); // Proceed to the next middleware or controller
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// Middleware to check if the user is an employee (admin role)
exports.isEmployee = async (req, res, next) => {
  try {
    // Fetch the user document from Firestore
    const userDoc = await admin
      .firestore()
      .collection("users")
      .doc(req.user.uid) // Use the UID from the decoded token
      .get();

    // Ensure user document exists
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userDoc.data();

    // Check if the user's role is 'employee'
    if (user.role !== "employee") {
      return res.status(403).json({ error: "Forbidden: Only employees are allowed" });
    }

    next(); // Proceed to the next middleware or controller
  } catch (error) {
    console.error("Authorization error:", error);
    return res.status(500).json({ error: "Authorization failed" });
  }
};
