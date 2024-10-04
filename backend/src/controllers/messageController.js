const admin = require('firebase-admin');
const ApiError = require('../utils/ApiError');

// Send a Message in a Conversation
exports.sendMessage = async (req, res, next) => {
  const { conversationId, senderId, message, selfDestructTime = null } = req.body;

  try {
    const conversationDoc = await admin.firestore().collection('conversations').doc(conversationId).get();
    if (!conversationDoc.exists) {
      return next(ApiError.notFound('Conversation not found'));
    }

    const conversation = conversationDoc.data();
    const participant = conversation.participants.find(p => p.userId === senderId);
    if (!participant || !participant.permissions.canSendMessages) {
      return next(ApiError.forbidden('You do not have permission to send messages in this conversation'));
    }

    const messageData = {
      senderId,
      message,
      selfDestructTime,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newMessage = await admin.firestore().collection('conversations').doc(conversationId).collection('messages').add(messageData);
    res.status(201).json({ messageId: newMessage.id, message: 'Message sent successfully' });
  } catch (error) {
    next(ApiError.internal('Failed to send message', error.message));
  }
};

// Edit a Message
exports.editMessage = async (req, res, next) => {
  const { conversationId, messageId, userId, newMessage } = req.body;

  try {
    const messageDoc = await admin.firestore().collection('conversations').doc(conversationId).collection('messages').doc(messageId).get();
    if (!messageDoc.exists) {
      return next(ApiError.notFound('Message not found'));
    }

    const message = messageDoc.data();
    if (message.senderId !== userId) {
      return next(ApiError.forbidden('You can only edit your own messages'));
    }

    await admin.firestore().collection('conversations').doc(conversationId).collection('messages').doc(messageId).update({
      message: newMessage,
      updatedAt: new Date(),
    });

    res.status(200).json({ message: 'Message edited successfully' });
  } catch (error) {
    next(ApiError.internal('Failed to edit message', error.message));
  }
};

// Delete a Message
exports.deleteMessage = async (req, res, next) => {
  const { conversationId, messageId, userId } = req.body;

  try {
    const messageDoc = await admin.firestore().collection('conversations').doc(conversationId).collection('messages').doc(messageId).get();
    if (!messageDoc.exists) {
      return next(ApiError.notFound('Message not found'));
    }

    const message = messageDoc.data();
    if (message.senderId !== userId) {
      return next(ApiError.forbidden('You can only delete your own messages'));
    }

    await admin.firestore().collection('conversations').doc(conversationId).collection('messages').doc(messageId).delete();
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    next(ApiError.internal('Failed to delete message', error.message));
  }
};

// Upload and Send an Image in a Conversation
exports.uploadAndSendImage = async (req, res, next) => {
  const { conversationId, senderId } = req.body;
  const file = req.file; // Assuming image file is sent as multipart/form-data

  if (!file) {
    return next(ApiError.badRequest('No image file uploaded'));
  }

  try {
    const conversationDoc = await admin.firestore().collection('conversations').doc(conversationId).get();
    if (!conversationDoc.exists) {
      return next(ApiError.notFound('Conversation not found'));
    }

    const conversation = conversationDoc.data();
    const participant = conversation.participants.find(p => p.userId === senderId);
    if (!participant || !participant.permissions.canSendMessages) {
      return next(ApiError.forbidden('You do not have permission to send messages in this conversation'));
    }

    const imageUrl = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${file.filename}`;
    const messageData = {
      senderId,
      message: imageUrl,
      messageType: 'image',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newMessage = await admin.firestore().collection('conversations').doc(conversationId).collection('messages').add(messageData);
    res.status(201).json({ messageId: newMessage.id, message: 'Image uploaded and message sent successfully' });
  } catch (error) {
    next(ApiError.internal('Failed to upload and send image', error.message));
  }
};

// Update Read Receipts
exports.updateReadReceipts = async (req, res, next) => {
  const { conversationId, userId } = req.body;

  try {
    const conversationDoc = await admin.firestore().collection('conversations').doc(conversationId).get();
    if (!conversationDoc.exists) {
      return next(ApiError.notFound('Conversation not found'));
    }

    await admin.firestore().collection('conversations').doc(conversationId).update({
      [`readReceipts.${userId}`]: new Date(),
    });

    res.status(200).json({ message: 'Read receipts updated successfully' });
  } catch (error) {
    next(ApiError.internal('Failed to update read receipts', error.message));
  }
};

// Typing Indicator
exports.typingIndicator = async (req, res, next) => {
  const { conversationId, userId, isTyping } = req.body;

  try {
    await admin.firestore().collection('conversations').doc(conversationId).update({
      [`typingIndicators.${userId}`]: isTyping,
    });

    res.status(200).json({ message: 'Typing indicator updated successfully' });
  } catch (error) {
    next(ApiError.internal('Failed to update typing indicator', error.message));
  }
};