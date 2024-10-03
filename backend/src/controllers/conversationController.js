const admin = require('firebase-admin');
const { verifyPayment } = require('../utils/payment');
const ApiError = require('../utils/ApiError');

// Create Conversation (handles direct, group, and channel)
exports.createConversation = async (req, res, next) => {
  const { userId, participants, type, currency = 'ETH' } = req.body; // Currency can be ETH, BTC, etc.

  try {
    // Fetch user document once to avoid multiple calls
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return next(ApiError.notFound('User not found'));
    }

    const user = userDoc.data();

    // Assign the conversation creator as the default admin
    const admins = [userId];

    // Check if the conversation is a channel
    if (type === 'channel') {
      if (user.channelPaymentStatus) {
        const newConversation = await admin.firestore().collection('conversations').add({
          participants,
          admins,
          type,
          participantCount: participants.length,
          createdAt: new Date(),
        });
        await triggerNotifications(participants, userId, 'Channel created');
        return res.status(201).json({ conversationId: newConversation.id, message: 'Channel created successfully' });
      } else {
        const paymentVerification = await verifyPayment(userId, 'channel', currency);
        if (paymentVerification.success) {
          const newConversation = await admin.firestore().collection('conversations').add({
            participants,
            admins,
            type,
            participantCount: participants.length,
            createdAt: new Date(),
          });
          await triggerNotifications(participants, userId, 'Channel created after payment');
          return res.status(201).json({ conversationId: newConversation.id, message: 'Channel created successfully after payment' });
        } else {
          return next(ApiError.paymentRequired('Payment not verified. Please complete the payment to create a channel.'));
        }
      }
    }

    // Handle group chats with more than 10 participants
    if (type === 'group' && participants.length > 10) {
      if (user.groupChatPaymentStatus) {
        const newConversation = await admin.firestore().collection('conversations').add({
          participants,
          admins,
          type,
          participantCount: participants.length,
          createdAt: new Date(),
        });
        await triggerNotifications(participants, userId, 'Group chat created');
        return res.status(201).json({ conversationId: newConversation.id, message: 'Group chat created successfully' });
      } else {
        const paymentVerification = await verifyPayment(userId, 'group', currency);
        if (paymentVerification.success) {
          const newConversation = await admin.firestore().collection('conversations').add({
            participants,
            admins,
            type,
            participantCount: participants.length,
            createdAt: new Date(),
          });
          await triggerNotifications(participants, userId, 'Group chat created after payment');
          return res.status(201).json({ conversationId: newConversation.id, message: 'Group chat created successfully after payment' });
        } else {
          return next(ApiError.paymentRequired('Payment not verified. Please complete the payment to create a group chat with more than 10 participants.'));
        }
      }
    }

    // Handle direct or group chats with 10 or fewer participants (no payment required)
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

// Helper function to trigger notifications
const triggerNotifications = async (participants, senderId, message) => {
  const notifications = participants
    .filter(participantId => participantId !== senderId)
    .map(async participantId => {
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
exports.addParticipants = async (req, res, next) => {
  const { conversationId, newParticipants } = req.body;

  try {
    const conversationDoc = await admin.firestore().collection('conversations').doc(conversationId).get();
    if (!conversationDoc.exists) {
      return next(ApiError.notFound('Conversation not found'));
    }

    // Update participants in Firestore
    await admin.firestore().collection('conversations').doc(conversationId).update({
      participants: admin.firestore.FieldValue.arrayUnion(...newParticipants),
    });

    res.status(200).json({ message: 'Participants added successfully' });
  } catch (error) {
    next(ApiError.internal('Error adding participants', error.message));
  }
};

// Remove Participants from Group Chat
exports.removeParticipants = async (req, res, next) => {
  const { conversationId, participantsToRemove } = req.body;

  try {
    const conversationDoc = await admin.firestore().collection('conversations').doc(conversationId).get();
    if (!conversationDoc.exists) {
      return next(ApiError.notFound('Conversation not found'));
    }

    // Update participants in Firestore
    await admin.firestore().collection('conversations').doc(conversationId).update({
      participants: admin.firestore.FieldValue.arrayRemove(...participantsToRemove),
    });

    res.status(200).json({ message: 'Participants removed successfully' });
  } catch (error) {
    next(ApiError.internal('Error removing participants', error.message));
  }
};

// Delete Conversation and Admin Handling
exports.deleteConversation = async (req, res, next) => {
  const { conversationId, userId } = req.body;

  try {
    const conversationDoc = await admin.firestore().collection('conversations').doc(conversationId).get();
    if (!conversationDoc.exists) {
      return next(ApiError.notFound('Conversation not found'));
    }

    const conversation = conversationDoc.data();
    // Remove the user from the conversation
    await admin.firestore().collection('conversations').doc(conversationId).update({
      participants: admin.firestore.FieldValue.arrayRemove(userId),
    });

    const updatedConversation = await admin.firestore().collection('conversations').doc(conversationId).get();
    const { participants, admins, type } = updatedConversation.data();

    // If direct conversation and one participant left, delete the conversation
    if (type === 'direct' && participants.length <= 1) {
      await deleteEntireConversation(conversationId);
      return res.status(200).json({ message: 'Direct conversation deleted as both participants are removed' });
    }

    // If only two admins remain and one is removed, delete the conversation
    if (admins.includes(userId) && admins.length <= 2) {
      await deleteEntireConversation(conversationId);
      return res.status(200).json({ message: 'Conversation deleted as only two admins remain and one left' });
    }

    res.status(200).json({ message: 'User removed from conversation' });
  } catch (error) {
    next(ApiError.internal('Error deleting conversation', error.message));
  }
};

// Helper function to delete an entire conversation
const deleteEntireConversation = async (conversationId) => {
  try {
    // Delete all messages in the conversation
    const messagesSnapshot = await admin.firestore().collection('conversations').doc(conversationId).collection('messages').get();
    const batch = admin.firestore().batch();

    messagesSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete the conversation itself
    batch.delete(admin.firestore().collection('conversations').doc(conversationId));

    // Commit the batch delete
    await batch.commit();

    console.log(`Conversation ${conversationId} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting conversation ${conversationId}:`, error);
  }
};

// Set Group Admin
exports.setGroupAdmin = async (req, res, next) => {
  const { conversationId, userId } = req.body;

  try {
    const conversationDoc = await admin.firestore().collection('conversations').doc(conversationId).get();
    if (!conversationDoc.exists) {
      return next(ApiError.notFound('Conversation not found'));
    }

    // Update the admin list in Firestore
    await admin.firestore().collection('conversations').doc(conversationId).update({
      admins: admin.firestore.FieldValue.arrayUnion(userId),
    });

    res.status(200).json({ message: 'User set as group admin successfully' });
  } catch (error) {
    next(ApiError.internal('Error setting group admin', error.message));
  }
};

// Rename Conversation/Group Chat
exports.renameConversation = async (req, res, next) => {
  const { conversationId, newName } = req.body;

  try {
    await admin.firestore().collection('conversations').doc(conversationId).update({
      name: newName,
    });

    res.status(200).json({ message: 'Conversation renamed successfully' });
  } catch (error) {
    next(ApiError.internal('Error renaming conversation', error.message));
  }
};

// Pin/Unpin Messages
exports.pinMessage = async (req, res, next) => {
  const { conversationId, messageId, pin } = req.body;

  try {
    await admin.firestore().collection('conversations').doc(conversationId).update({
      pinnedMessages: pin
        ? admin.firestore.FieldValue.arrayUnion(messageId)
        : admin.firestore.FieldValue.arrayRemove(messageId),
    });

    res.status(200).json({ message: `Message ${pin ? 'pinned' : 'unpinned'} successfully` });
  } catch (error) {
    next(ApiError.internal(`Error ${pin ? 'pinning' : 'unpinning'} message`, error.message));
  }
};

// Clear Conversation
exports.clearConversation = async (req, res, next) => {
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
};
