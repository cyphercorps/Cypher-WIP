// backend_cli/utils/fileHelper.js

const fs = require('fs');
const path = require('path');

// Save response data to a file
const saveToFile = (filename, data) => {
  const filePath = path.join(__dirname, '../../saved_files', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Data saved to ${filePath}`);
};

// Load data from a file
const loadFromFile = (filename) => {
  const filePath = path.join(__dirname, '../../saved_files', filename);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } else {
    throw new Error(`File ${filename} not found.`);
  }
};

module.exports = {
  saveToFile,
  loadFromFile,
};
