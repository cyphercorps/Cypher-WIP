const cron = require('node-cron');
const { cleanupSelfDestructingMessages } = require('./path/to/messageCleanup');

// Schedule the cleanup task to run every hour
cron.schedule('0 * * * *', () => {
  console.log('Running self-destructing message cleanup...');
  cleanupSelfDestructingMessages();
});
