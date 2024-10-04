// backend_cli/commands/profileCommands.js

const { makeApiRequest } = require('../utils/apiRequest');
const { promptForInput } = require('../utils/promptHelper');
const logger = require('../utils/logger');
const fs = require('fs');
const FormData = require('form-data');
require('dotenv').config();

const BASE_URL = process.env.API_BASE_URL;

// Get user profile
const getProfile = async () => {
  try {
    const uid = await promptForInput('Enter your UID:');

    const response = await makeApiRequest('GET', `${BASE_URL}/api/profile/${uid}`);
    console.log('User Profile:', response);
    logger.logInfo('Fetched user profile successfully');
  } catch (error) {
    console.error('Failed to fetch profile:', error.message);
    logger.logCLIError('Fetching profile failed', error);
  }
};

// Update user profile
const updateProfile = async () => {
  try {
    const uid = await promptForInput('Enter your UID:');
    const bio = await promptForInput('Enter your bio:');
    const avatar = await promptForInput('Enter your avatar URL:');
    const privacySettings = await promptForInput('Enter privacy settings (JSON format):');

    const response = await makeApiRequest('PUT', `${BASE_URL}/api/profile/${uid}`, {
      bio,
      avatar,
      privacySettings: JSON.parse(privacySettings),
    });
    console.log('Profile updated successfully:', response.message);
    logger.logInfo('User profile updated successfully');
  } catch (error) {
    console.error('Failed to update profile:', error.message);
    logger.logCLIError('Updating profile failed', error);
  }
};

// Upload profile photo
const uploadProfilePhoto = async () => {
  try {
    const uid = await promptForInput('Enter your UID:');
    const filePath = await promptForInput('Enter the path to your profile photo:');

    const formData = new FormData();
    formData.append('profilePhoto', fs.createReadStream(filePath));

    const response = await makeApiRequest('POST', `${BASE_URL}/api/profile/upload-photo`, formData, {
      headers: formData.getHeaders(),
    });
    console.log('Profile photo uploaded successfully:', response.url);
    logger.logInfo('Profile photo uploaded successfully');
  } catch (error) {
    console.error('Failed to upload profile photo:', error.message);
    logger.logCLIError('Profile photo upload failed', error);
  }
};

// Search users by CypherTag
const searchUsers = async () => {
  try {
    const searchTerm = await promptForInput('Enter search term for CypherTag:');

    const response = await makeApiRequest('GET', `${BASE_URL}/api/profile/search`, {
      params: { searchTerm },
    });
    console.log('Search Results:', response);
    logger.logInfo('User search completed successfully');
  } catch (error) {
    console.error('Failed to search users:', error.message);
    logger.logCLIError('User search failed', error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  searchUsers,
};
