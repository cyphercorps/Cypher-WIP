const { getProfile, updateProfile, uploadProfilePhoto, searchUsers } = require('../../src/controllers/profileController'); // Import backend functions directly
const { promptForInput } = require('../utils/promptHelper');
const logger = require('../utils/logger');
const fs = require('fs');
require('dotenv').config();

// Get user profile
const getProfileCommand = async () => {
  try {
    const uid = await promptForInput('Enter your UID:');

    const req = { params: { uid } };
    const res = {
      status: (code) => ({
        json: (data) => {
          console.log(`Status: ${code}, Response:`, data);
        },
      }),
    };
    const next = (error) => {
      if (error) {
        throw error;
      }
    };

    await getProfile(req, res, next);
    logger.logInfo('Fetched user profile successfully');
  } catch (error) {
    console.error('Failed to fetch profile:', error.message);
    logger.logCLIError('Fetching profile failed', error);
  }
};

// Update user profile
const updateProfileCommand = async () => {
  try {
    const uid = await promptForInput('Enter your UID:');
    const bio = await promptForInput('Enter your bio:');
    const avatar = await promptForInput('Enter your avatar URL:');
    const privacySettings = await promptForInput('Enter privacy settings (JSON format):');

    const req = { params: { uid }, body: { bio, avatar, privacySettings: JSON.parse(privacySettings) } };
    const res = {
      status: (code) => ({
        json: (data) => {
          console.log(`Status: ${code}, Response:`, data);
        },
      }),
    };
    const next = (error) => {
      if (error) {
        throw error;
      }
    };

    await updateProfile(req, res, next);
    logger.logInfo('User profile updated successfully');
  } catch (error) {
    console.error('Failed to update profile:', error.message);
    logger.logCLIError('Updating profile failed', error);
  }
};

// Upload profile photo
const uploadProfilePhotoCommand = async () => {
  try {
    const uid = await promptForInput('Enter your UID:');
    const filePath = await promptForInput('Enter the path to your profile photo:');

    if (!fs.existsSync(filePath)) {
      console.error('Profile photo file not found at the specified path');
      return;
    }

    const req = { params: { uid }, file: { path: filePath, fieldName: 'profilePhoto' } };
    const res = {
      status: (code) => ({
        json: (data) => {
          console.log(`Status: ${code}, Response:`, data);
        },
      }),
    };
    const next = (error) => {
      if (error) {
        throw error;
      }
    };

    await uploadProfilePhoto(req, res, next);
    logger.logInfo('Profile photo uploaded successfully');
  } catch (error) {
    console.error('Failed to upload profile photo:', error.message);
    logger.logCLIError('Profile photo upload failed', error);
  }
};

// Search users by CypherTag
const searchUsersCommand = async () => {
  try {
    const searchTerm = await promptForInput('Enter search term for CypherTag:');

    const req = { query: { searchTerm } };
    const res = {
      status: (code) => ({
        json: (data) => {
          console.log(`Status: ${code}, Response:`, data);
        },
      }),
    };
    const next = (error) => {
      if (error) {
        throw error;
      }
    };

    await searchUsers(req, res, next);
    logger.logInfo('User search completed successfully');
  } catch (error) {
    console.error('Failed to search users:', error.message);
    logger.logCLIError('User search failed', error);
  }
};

module.exports = {
  getProfileCommand,
  updateProfileCommand,
  uploadProfilePhotoCommand,
  searchUsersCommand,
};