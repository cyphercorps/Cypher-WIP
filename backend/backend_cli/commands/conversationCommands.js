// conversationCommands.js

const readline = require('readline');
const axios = require('axios');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const baseUrl = 'http://localhost:3000/api/conversations';

// Utility function to handle API requests
const makeRequest = async (method, url, data = null) => {
  try {
    const response = await axios({
      method,
      url,
      data
    });
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

// Create a conversation
const createConversation = () => {
  rl.question('Enter userId: ', (userId) => {
    rl.question('Enter participants (comma-separated): ', (participants) => {
      rl.question('Enter conversation type (direct/group/channel): ', (type) => {
        makeRequest('post', `${baseUrl}/create`, {
          userId,
          participants: participants.split(','),
          type
        });
        rl.close();
      });
    });
  });
};

// Add participants to a group chat
const addParticipants = () => {
  rl.question('Enter conversationId: ', (conversationId) => {
    rl.question('Enter participants to add (comma-separated): ', (newParticipants) => {
      makeRequest('post', `${baseUrl}/add-participants`, {
        conversationId,
        newParticipants: newParticipants.split(',')
      });
      rl.close();
    });
  });
};

// Remove participants from a group chat
const removeParticipants = () => {
  rl.question('Enter conversationId: ', (conversationId) => {
    rl.question('Enter participants to remove (comma-separated): ', (participantsToRemove) => {
      makeRequest('post', `${baseUrl}/remove-participants`, {
        conversationId,
        participantsToRemove: participantsToRemove.split(',')
      });
      rl.close();
    });
  });
};

// Delete a conversation
const deleteConversation = () => {
  rl.question('Enter conversationId: ', (conversationId) => {
    rl.question('Enter userId (owner): ', (userId) => {
      makeRequest('delete', `${baseUrl}/delete`, {
        conversationId,
        userId
      });
      rl.close();
    });
  });
};

// Set a group admin
const setGroupAdmin = () => {
  rl.question('Enter conversationId: ', (conversationId) => {
    rl.question('Enter userId to set as admin: ', (userId) => {
      makeRequest('post', `${baseUrl}/set-admin`, {
        conversationId,
        userId
      });
      rl.close();
    });
  });
};

// Rename a conversation
const renameConversation = () => {
  rl.question('Enter conversationId: ', (conversationId) => {
    rl.question('Enter new name for the conversation: ', (newName) => {
      makeRequest('patch', `${baseUrl}/rename`, {
        conversationId,
        newName
      });
      rl.close();
    });
  });
};

// Pin or unpin a message
const pinMessage = () => {
  rl.question('Enter conversationId: ', (conversationId) => {
    rl.question('Enter messageId: ', (messageId) => {
      rl.question('Pin or unpin (pin/unpin): ', (action) => {
        const pin = action.toLowerCase() === 'pin';
        makeRequest('post', `${baseUrl}/pin-message`, {
          conversationId,
          messageId,
          pin
        });
        rl.close();
      });
    });
  });
};

// Clear all messages in a conversation
const clearConversation = () => {
  rl.question('Enter conversationId: ', (conversationId) => {
    makeRequest('post', `${baseUrl}/clear`, {
      conversationId
    });
    rl.close();
  });
};

// Leave a conversation
const leaveConversation = () => {
  rl.question('Enter conversationId: ', (conversationId) => {
    rl.question('Enter userId: ', (userId) => {
      makeRequest('post', `${baseUrl}/leave`, {
        conversationId,
        userId
      });
      rl.close();
    });
  });
};

// Menu to choose command
const menu = async () => {
  const { option } = await inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: 'Select a conversation command:',
      choices: [
        'Create Conversation',
        'Add Participants',
        'Remove Participants',
        'Delete Conversation',
        'Set Group Admin',
        'Rename Conversation',
        'Pin/Unpin Message',
        'Clear Conversation',
        'Leave Conversation',
        'Exit'
      ],
    },
  ]);

  switch (option) {
    case 'Create Conversation':
      await createConversation();
      break;
    case 'Add Participants':
      await addParticipants();
      break;
    case 'Remove Participants':
      await removeParticipants();
      break;
    case 'Delete Conversation':
      await deleteConversation();
      break;
    case 'Set Group Admin':
      await setGroupAdmin();
      break;
    case 'Rename Conversation':
      await renameConversation();
      break;
    case 'Pin/Unpin Message':
      await pinMessage();
      break;
    case 'Clear Conversation':
      await clearConversation();
      break;
    case 'Leave Conversation':
      await leaveConversation();
      break;
    case 'Exit':
      console.log('Exiting conversation commands menu...');
      return;
    default:
      console.log('Invalid option');
  }

  await menu();
};

module.exports = {
  menu,
  createConversation,
  addParticipants,
  removeParticipants,
  deleteConversation,
  setGroupAdmin,
  renameConversation,
  pinMessage,
  clearConversation,
  leaveConversation
};