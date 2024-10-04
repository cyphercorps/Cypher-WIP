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

// Set Conversation Profile Photo
exports.setConversationProfilePhoto = async (req, res, next) => {
  const { conversationId } = req.params;

  try {
    const profilePhoto = req.file;

    if (!profilePhoto) {
      return res.status(400).json({ error: 'No profile photo provided' });
    }

    // Simulate uploading the profile photo to a storage service
    // This should ideally include logic to save the photo to a storage bucket like Firebase Storage
    const photoUrl = `fake-storage-url/${profilePhoto.originalname}`;

    // Update conversation document with profile photo URL
    await admin.firestore().collection('conversations').doc(conversationId).update({
      profilePhotoUrl: photoUrl,
    });

    res.status(200).json({ message: 'Profile photo set successfully' });
  } catch (error) {
    console.error('Error setting conversation profile photo:', error);
    next(ApiError.internal('Failed to set conversation profile photo', error.message));
  }
};

// Pin a Message in a Conversation
exports.pinMessage = async (req, res, next) => {
  const { conversationId, messageId } = req.body;

  try {
    // Update the conversation document to set the pinned message
    await admin.firestore().collection('conversations').doc(conversationId).update({
      pinnedMessageId: messageId,
    });

    res.status(200).json({ message: 'Message pinned successfully' });
  } catch (error) {
    console.error('Error pinning message:', error);
    next(ApiError.internal('Failed to pin message', error.message));
  }
};

// Rename a Conversation
exports.renameConversation = async (req, res, next) => {
  const { conversationId, newName } = req.body;

  try {
    // Update the conversation document with the new name
    await admin.firestore().collection('conversations').doc(conversationId).update({
      name: newName,
    });

    res.status(200).json({ message: 'Conversation renamed successfully' });
  } catch (error) {
    console.error('Error renaming conversation:', error);
    next(ApiError.internal('Failed to rename conversation', error.message));
  }
};
