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

    // Assign the conversation creator as the default owner and admin
    const owners = [userId];
    const admins = [{ userId, permissions: ['ADD_PARTICIPANTS', 'REMOVE_PARTICIPANTS', 'RENAME_CONVERSATION', 'PIN_MESSAGE', 'UPLOAD_PROFILE_PHOTO', 'SET_PARTICIPANT_PERMISSIONS'] }];

    // Set default participant permissions
    const participantsWithPermissions = participants.map(participantId => ({
      userId: participantId,
      permissions: {
        canSendMessages: true,
        canDeleteOwnMessages: true,
        canLeaveConversation: true,
      },
    }));

    // Check if the conversation is a channel
    if (type === 'channel') {
      if (user.channelPaymentStatus) {
        const newConversation = await admin.firestore().collection('conversations').add({
          participants: participantsWithPermissions,
          owners,
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
            participants: participantsWithPermissions,
            owners,
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
          participants: participantsWithPermissions,
          owners,
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
            participants: participantsWithPermissions,
            owners,
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
      participants: participantsWithPermissions,
      owners,
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

// Add Participants to Group Chat
exports.addParticipants = async (req, res, next) => {
  const { conversationId, newParticipants, userId } = req.body;

  try {
    const conversationDoc = await admin.firestore().collection('conversations').doc(conversationId).get();
    if (!conversationDoc.exists) {
      return next(ApiError.notFound('Conversation not found'));
    }

    const conversation = conversationDoc.data();

    // Only owners or admins with permission can add participants
    const admin = conversation.admins.find((admin) => admin.userId === userId);
    if (!conversation.owners.includes(userId) && (!admin || !admin.permissions.includes('ADD_PARTICIPANTS'))) {
      return next(ApiError.forbidden('Only owners or admins with permission can add participants'));
    }

    // Set default permissions for new participants
    const newParticipantsWithPermissions = newParticipants.map(participantId => ({
      userId: participantId,
      permissions: {
        canSendMessages: true,
        canDeleteOwnMessages: true,
        canLeaveConversation: true,
      },
    }));

    // Update participants in Firestore
    await admin.firestore().collection('conversations').doc(conversationId).update({
      participants: admin.firestore.FieldValue.arrayUnion(...newParticipantsWithPermissions),
    });

    res.status(200).json({ message: 'Participants added successfully' });
  } catch (error) {
    next(ApiError.internal('Error adding participants', error.message));
  }
};

// Remove Participants from Group Chat
exports.removeParticipants = async (req, res, next) => {
  const { conversationId, participantsToRemove, userId } = req.body;

  try {
    const conversationDoc = await admin.firestore().collection('conversations').doc(conversationId).get();
    if (!conversationDoc.exists) {
      return next(ApiError.notFound('Conversation not found'));
    }

    const conversation = conversationDoc.data();

    // Only owners or admins with permission can remove participants
    const admin = conversation.admins.find((admin) => admin.userId === userId);
    if (!conversation.owners.includes(userId) && (!admin || !admin.permissions.includes('REMOVE_PARTICIPANTS'))) {
      return next(ApiError.forbidden('Only owners or admins with permission can remove participants'));
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

// Set Participant Permissions
exports.setParticipantPermissions = async (req, res, next) => {
  const { conversationId, participantId, permissions, userId } = req.body;

  try {
    const conversationDoc = await admin.firestore().collection('conversations').doc(conversationId).get();
    if (!conversationDoc.exists) {
      return next(ApiError.notFound('Conversation not found'));
    }

    const conversation = conversationDoc.data();

    // Only owners or admins with permission can change participant permissions
    const admin = conversation.admins.find((admin) => admin.userId === userId);
    if (!conversation.owners.includes(userId) && (!admin || !admin.permissions.includes('SET_PARTICIPANT_PERMISSIONS'))) {
      return next(ApiError.forbidden('Only owners or admins with permission can set participant permissions'));
    }

    // Find participant and update permissions
    const updatedParticipants = conversation.participants.map(participant => {
      if (participant.userId === participantId) {
        return { ...participant, permissions };
      }
      return participant;
    });

    // Update participants in Firestore
    await admin.firestore().collection('conversations').doc(conversationId).update({
      participants: updatedParticipants,
    });

    res.status(200).json({ message: 'Participant permissions updated successfully' });
  } catch (error) {
    next(ApiError.internal('Error setting participant permissions', error.message));
  }
};

// Rename Conversation
exports.renameConversation = async (req, res, next) => {
  const { conversationId, newName, userId } = req.body;

  try {
    const conversationDoc = await admin.firestore().collection('conversations').doc(conversationId).get();
    if (!conversationDoc.exists) {
      return next(ApiError.notFound('Conversation not found'));
    }

    const conversation = conversationDoc.data();

    // Only owners or admins with permission can rename the conversation
    const admin = conversation.admins.find((admin) => admin.userId === userId);
    if (!conversation.owners.includes(userId) && (!admin || !admin.permissions.includes('RENAME_CONVERSATION'))) {
      return next(ApiError.forbidden('Only owners or admins with permission can rename the conversation'));
    }

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
  const { conversationId, messageId, pin, userId } = req.body;

  try {
    const conversationDoc = await admin.firestore().collection('conversations').doc(conversationId).get();
    if (!conversationDoc.exists) {
      return next(ApiError.notFound('Conversation not found'));
    }

    const conversation = conversationDoc.data();

    // Only owners or admins with permission can pin/unpin messages
    const admin = conversation.admins.find((admin) => admin.userId === userId);
    if (!conversation.owners.includes(userId) && (!admin || !admin.permissions.includes('PIN_MESSAGE'))) {
      return next(ApiError.forbidden('Only owners or admins with permission can pin/unpin messages'));
    }

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