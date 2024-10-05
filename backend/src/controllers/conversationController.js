// conversationController.js

const admin = require('firebase-admin');
const { verifyPayment } = require('../utils/payment');
const ApiError = require('../utils/ApiError');
const permissionMiddleware = require('../middleware/permissionMiddleware');

// Utility function to get conversation reference and snapshot
const getConversation = async (conversationId) => {
  const conversationRef = admin.firestore().collection('conversations').doc(conversationId);
  const conversationSnapshot = await conversationRef.get();
  if (!conversationSnapshot.exists) throw new Error('Conversation not found');
  return { conversationRef, conversationData: conversationSnapshot.data() };
};

// Create Conversation (handles direct, group, and channel)
exports.createConversation = async (req, res, next) => {
  const { userId, participants, type, currency = 'ETH' } = req.body;
  try {
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return next(ApiError.notFound('User not found'));
    }
    const user = userDoc.data();
    const admins = [userId];

    if (type === 'channel') {
      if (user.channelPaymentStatus || (await verifyPayment(userId, 'channel', currency)).success) {
        const newConversation = await admin.firestore().collection('conversations').add({
          participants,
          admins,
          type,
          participantCount: participants.length,
          createdAt: new Date(),
        });
        await triggerNotifications(participants, userId, 'Channel created');
        return res.status(201).json({ conversationId: newConversation.id, message: 'Channel created successfully' });
      }
      return next(ApiError.paymentRequired('Payment not verified. Please complete the payment to create a channel.'));
    }

    if (type === 'group' && participants.length > 10) {
      if (user.groupChatPaymentStatus || (await verifyPayment(userId, 'group', currency)).success) {
        const newConversation = await admin.firestore().collection('conversations').add({
          participants,
          admins,
          type,
          participantCount: participants.length,
          createdAt: new Date(),
        });
        await triggerNotifications(participants, userId, 'Group chat created');
        return res.status(201).json({ conversationId: newConversation.id, message: 'Group chat created successfully' });
      }
      return next(ApiError.paymentRequired('Payment not verified. Please complete the payment to create a group chat with more than 10 participants.'));
    }

    const newConversation = await admin.firestore().collection('conversations').add({
      participants,
      admins,
      type,
      participantCount: participants.length,
      createdAt: new Date(),
    });
    await triggerNotifications(participants, userId, 'Conversation created');
    return res.status(201).json({ conversationId: newConversation.id, message: 'Conversation created successfully' });
  } catch (error) {
    return next(ApiError.internal('Failed to create conversation', error.message));
  }
};

// Get User Conversations
exports.getUserConversations = async (req, res, next) => {
  const { uid } = req.params;
  try {
    const conversationsSnapshot = await admin.firestore().collection('conversations').where('participants', 'array-contains', uid).get();
    if (conversationsSnapshot.empty) {
      return res.status(404).json({ message: 'No conversations found for this user' });
    }
    const conversations = conversationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ conversations });
  } catch (error) {
    next(ApiError.internal('Error fetching user conversations', error.message));
  }
};

// Helper function to trigger notifications
const triggerNotifications = async (participants, senderId, message) => {
  const notifications = participants.filter(participantId => participantId !== senderId).map(async participantId => {
    const userDoc = await admin.firestore().collection('users').doc(participantId).get();
    const user = userDoc.data();
    if (user.notifications) {
      await admin.firestore().collection('notifications').add({
        recipientId: participantId,
        senderId,
        message: message,
        timestamp: new Date(),
        read: false,
      });
    }
  });
  await Promise.all(notifications);
};

// Add Participants to Group Chat
exports.addParticipants = [
  permissionMiddleware('admin'),
  async (req, res, next) => {
    const { conversationId, newParticipants } = req.body;
    try {
      const { conversationRef } = await getConversation(conversationId);
      await conversationRef.update({ participants: admin.firestore.FieldValue.arrayUnion(...newParticipants) });
      res.status(200).json({ message: 'Participants added successfully' });
    } catch (error) {
      next(ApiError.internal('Error adding participants', error.message));
    }
  }
];

// Remove Participants from Group Chat
exports.removeParticipants = [
  permissionMiddleware('admin'),
  async (req, res, next) => {
    const { conversationId, participantsToRemove } = req.body;
    try {
      const { conversationRef } = await getConversation(conversationId);
      await conversationRef.update({ participants: admin.firestore.FieldValue.arrayRemove(...participantsToRemove) });
      res.status(200).json({ message: 'Participants removed successfully' });
    } catch (error) {
      next(ApiError.internal('Error removing participants', error.message));
    }
  }
];

// Delete Conversation and Admin Handling
exports.deleteConversation = [
  permissionMiddleware('owner'),
  async (req, res, next) => {
    const { conversationId, userId } = req.body;
    try {
      const { conversationRef, conversationData } = await getConversation(conversationId);
      await conversationRef.update({ participants: admin.firestore.FieldValue.arrayRemove(userId) });
      if (conversationData.type === 'direct' && conversationData.participants.length <= 1) {
        await deleteEntireConversation(conversationId);
        return res.status(200).json({ message: 'Direct conversation deleted as both participants are removed' });
      }
      if (conversationData.admins.includes(userId) && conversationData.admins.length <= 2) {
        await deleteEntireConversation(conversationId);
        return res.status(200).json({ message: 'Conversation deleted as only two admins remain and one left' });
      }
      res.status(200).json({ message: 'User removed from conversation' });
    } catch (error) {
      next(ApiError.internal('Error deleting conversation', error.message));
    }
  }
];

// Helper function to delete an entire conversation
const deleteEntireConversation = async (conversationId) => {
  try {
    const messagesSnapshot = await admin.firestore().collection('conversations').doc(conversationId).collection('messages').get();
    const batch = admin.firestore().batch();
    messagesSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    batch.delete(admin.firestore().collection('conversations').doc(conversationId));
    await batch.commit();
  } catch (error) {
    console.error(`Error deleting conversation ${conversationId}:`, error);
  }
};

// Set Group Admin
exports.setGroupAdmin = [
  permissionMiddleware('owner'),
  async (req, res, next) => {
    const { conversationId, userId } = req.body;
    try {
      const { conversationRef } = await getConversation(conversationId);
      await conversationRef.update({ admins: admin.firestore.FieldValue.arrayUnion(userId) });
      res.status(200).json({ message: 'User set as group admin successfully' });
    } catch (error) {
      next(ApiError.internal('Error setting group admin', error.message));
    }
  }
];

// Rename Conversation/Group Chat
exports.renameConversation = [
  permissionMiddleware('admin'),
  async (req, res, next) => {
    const { conversationId, newName } = req.body;
    try {
      const { conversationRef } = await getConversation(conversationId);
      await conversationRef.update({ conversationName: newName, updatedAt: new Date() });
      res.status(200).json({ message: 'Conversation renamed successfully' });
    } catch (error) {
      next(ApiError.internal('Error renaming conversation', error.message));
    }
  }
];

// Pin/Unpin Messages
exports.pinMessage = [
  permissionMiddleware('admin'),
  async (req, res, next) => {
    const { conversationId, messageId, pin } = req.body;
    try {
      const { conversationRef } = await getConversation(conversationId);
      await conversationRef.update({
        pinnedMessages: pin
          ? admin.firestore.FieldValue.arrayUnion(messageId)
          : admin.firestore.FieldValue.arrayRemove(messageId),
      });
      res.status(200).json({ message: `Message ${pin ? 'pinned' : 'unpinned'} successfully` });
    } catch (error) {
      next(ApiError.internal(`Error ${pin ? 'pinning' : 'unpinning'} message`, error.message));
    }
  }
];

// Clear Conversation
exports.clearConversation = [
  permissionMiddleware('owner'),
  async (req, res, next) => {
    const { conversationId } = req.body;
    try {
      const messagesSnapshot = await admin.firestore().collection('conversations').doc(conversationId).collection('messages').get();
      const batch = admin.firestore().batch();
      messagesSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      res.status(200).json({ message: 'Conversation cleared successfully' });
    } catch (error) {
      next(ApiError.internal('Error clearing conversation', error.message));
    }
  }
];

// Leave Conversation
exports.leaveConversation = [
  permissionMiddleware('participant'),
  async (req, res, next) => {
    const { conversationId, userId } = req.body;
    try {
      const { conversationRef, conversationData } = await getConversation(conversationId);
      if (conversationData.owner === userId) {
        return res.status(403).json({ message: 'Owner cannot leave the conversation. Consider deleting the conversation instead.' });
      }

      // Remove user from participants
      await conversationRef.update({
        participants: admin.firestore.FieldValue.arrayRemove(userId),
      });

      // If conversation becomes empty, delete it
      const updatedConversation = await conversationRef.get();
      if (updatedConversation.data().participants.length === 0) {
        await deleteEntireConversation(conversationId);
        return res.status(200).json({ message: 'Conversation deleted as there are no participants left.' });
      }

      res.status(200).json({ message: 'User successfully left the conversation.' });
    } catch (error) {
      next(ApiError.internal('Error leaving conversation', error.message));
    }
  }
];