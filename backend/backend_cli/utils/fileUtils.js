// backend_cli/utils/fileUtils.js

const fs = require('fs');
const path = require('path');

/**
 * List all files in a given directory.
 * @param {string} dirPath - The directory to list files from.
 * @returns {Array<string>} - List of filenames in the directory.
 */
const listDirectoryFiles = (dirPath) => {
  try {
    const absolutePath = path.join(__dirname, dirPath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Directory does not exist: ${absolutePath}`);
    }
    return fs.readdirSync(absolutePath);
  } catch (error) {
    console.error(`Error listing directory files: ${error.message}`);
    throw error;
  }
};

/**
 * Read the contents of a given file.
 * @param {string} filePath - The file path to read from.
 * @returns {string} - Contents of the file.
 */
const readFileContents = (filePath) => {
  try {
    const absolutePath = path.join(__dirname, filePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File does not exist: ${absolutePath}`);
    }
    return fs.readFileSync(absolutePath, 'utf-8');
  } catch (error) {
    console.error(`Error reading file contents: ${error.message}`);
    throw error;
  }
};

module.exports = {
  listDirectoryFiles,
  readFileContents,
};