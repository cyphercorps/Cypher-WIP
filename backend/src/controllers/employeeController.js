const admin = require('firebase-admin');

// Delete a user by Employee (Admin role)
exports.deleteUser = async (req, res, next) => {
  const { uid } = req.params;

  try {
    // Delete user from Firebase Auth
    await admin.auth().deleteUser(uid);

    // Delete user data from Firestore
    await admin.firestore().collection('users').doc(uid).delete();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    next(ApiError.internal('Failed to delete user', error.message));
  }
};

// Grant Free Channel/Group Chat Creation to Users
exports.grantFreeAccess = async (req, res, next) => {
  const { userId, freeChannels, freeGroups } = req.body;

  try {
    // Update the user document with free channels and groups count
    await admin.firestore().collection('users').doc(userId).update({
      freeChannels,
      freeGroups,
    });

    res.status(200).json({ message: 'Free access granted successfully' });
  } catch (error) {
    console.error('Error granting free access:', error);
    next(ApiError.internal('Failed to grant free access', error.message));
  }
};

// Get Platform Statistics (Total Users, Messages, Conversations)
exports.getPlatformStats = async (req, res, next) => {
  try {
    // Get total number of users
    const usersCount = (await admin.firestore().collection('users').get()).size;

    // Get total number of messages
    const messagesCount = (await admin.firestore().collectionGroup('messages').get()).size;

    // Get total number of conversations
    const conversationsCount = (await admin.firestore().collection('conversations').get()).size;

    res.status(200).json({
      totalUsers: usersCount,
      totalMessages: messagesCount,
      totalConversations: conversationsCount,
    });
  } catch (error) {
    console.error('Error retrieving platform stats:', error);
    next(ApiError.internal('Failed to retrieve platform stats', error.message));
  }
};

// Assign Admin Privileges (For Cypher Employee Admins)
exports.assignAdminPrivileges = async (req, res, next) => {
  const { userId } = req.body;

  try {
    // Update the user role to 'employee' (admin privileges)
    await admin.firestore().collection('users').doc(userId).update({
      role: 'employee',
    });

    res.status(200).json({ message: 'Admin privileges assigned successfully' });
  } catch (error) {
    console.error('Error assigning admin privileges:', error);
    next(ApiError.internal('Failed to assign admin privileges', error.message));
  }
};
