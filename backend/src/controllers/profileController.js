const admin = require('firebase-admin');
const ApiError = require('../utils/ApiError');

// Get User Profile
exports.getProfile = async (req, res, next) => {
  const { uid } = req.params;

  try {
    const userDoc = await admin.firestore().collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return next(ApiError.notFound('User not found'));
    }

    const user = userDoc.data();

    // Return profile data including profile photo URL
    res.status(200).json({
      cypherTag: user.cypherTag,
      bio: user.bio || '',
      avatar: user.avatar || '',
      notifications: user.notifications || {},
      privacySettings: user.privacySettings || {},
      profilePhotoURL: user.profilePhotoURL || null,  // Return profile photo URL if available
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Failed to retrieve profile:', error);
    next(ApiError.internal('Failed to retrieve profile', error.message));
  }
};

// Update User Profile
exports.updateProfile = async (req, res, next) => {
  const { uid } = req.params;
  const { bio, avatar, notifications, privacySettings } = req.body;

  try {
    await admin.firestore().collection('users').doc(uid).update({
      bio,
      avatar,
      notifications,
      privacySettings,
      updatedAt: new Date(), // Update the timestamp
    });

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Failed to update profile:', error);
    next(ApiError.internal('Failed to update profile', error.message));
  }
};

// Incremental Search for CypherTags
exports.searchUsers = async (req, res, next) => {
  const { searchTerm } = req.query;  // Extract the search term from query parameters

  if (!searchTerm) {
    return next(ApiError.badRequest('Search term is required'));
  }

  try {
    // Query Firestore for users whose CypherTags start with the searchTerm
    const usersSnapshot = await admin.firestore().collection('users')
      .where('cypherTag', '>=', searchTerm)   // Start at the search term
      .where('cypherTag', '<=', searchTerm + '\uf8ff')  // End at the last matching term
      .limit(10)  // Limit results to the top 10 for performance
      .get();

    // Map the search results to user objects
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      cypherTag: doc.data().cypherTag,
      profilePhotoURL: doc.data().profilePhotoURL || '',  // Include profile photo if available
    }));

    res.status(200).json(users);
  } catch (error) {
    console.error('Failed to search users:', error);
    next(ApiError.internal('Failed to search users', error.message));
  }
};

// Upload Profile Photo
exports.uploadProfilePhoto = async (req, res, next) => {
  const { uid } = req.body;
  const file = req.file;

  if (!file) {
    return next(ApiError.badRequest('No file uploaded'));
  }

  try {
    // Define Firebase Storage bucket
    const bucket = admin.storage().bucket();

    // Create a unique filename for the upload
    const fileName = `profile_photos/${uid}_${Date.now()}`;

    // Upload the file to Firebase Storage
    const fileUpload = bucket.file(fileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (error) => {
      console.error('Upload error:', error);
      next(ApiError.internal('Error uploading profile photo', error.message));
    });

    blobStream.on('finish', async () => {
      // Get the public URL for the uploaded profile photo
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;

      // Update Firestore with the profile photo URL
      await admin.firestore().collection('users').doc(uid).update({
        profilePhotoURL: publicUrl,
      });

      res.status(200).json({ message: 'Profile photo uploaded successfully', url: publicUrl });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    next(ApiError.internal('Error uploading profile photo', error.message));
  }
};
