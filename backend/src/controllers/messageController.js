const admin = require('firebase-admin');
const crypto = require('crypto');
const ApiError = require('../utils/ApiError');

// AES Encryption Helper
const encryptMessage = (message, secretKey) => {
  const cipher = crypto.createCipher('aes-256-cbc', secretKey);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

// Send Message (With Notifications, Read Receipts, and Self-Destruct Timer)
exports.sendMessage = async (req, res, next) => {
  const { conversationId, senderId, message, selfDestructTime } = req.body;

  try {
    // Encrypt the message
    const secretKey = process.env.MESSAGE_SECRET_KEY;
    const encryptedMessage = encryptMessage(message, secretKey);

    const timestamp = new Date();

    // Store message in Firestore
    const newMessage = await admin.firestore().collection('conversations').doc(conversationId).collection('messages').add({
      senderId,
      message: encryptedMessage,
      timestamp,
      selfDestructTime: selfDestructTime ? timestamp.getTime() + selfDestructTime : null, // Add self-destruct timer
    });

    // Store message in Firebase Realtime Database for real-time syncing
    const messageData = {
      messageId: newMessage.id,
      senderId,
      message: encryptedMessage,
      timestamp: timestamp.toISOString(),
      selfDestructTime: selfDestructTime ? timestamp.getTime() + selfDestructTime : null,
    };

    await admin.database().ref(`/conversations/${conversationId}/messages`).push(messageData);

    res.status(201).json({ message: 'Message sent', messageId: newMessage.id });
  } catch (error) {
    next(ApiError.internal('Error sending message', error.message));
  }
};

// Edit a Message
exports.editMessage = async (req, res, next) => {
  const { conversationId, messageId, newMessage } = req.body;

  try {
    // Encrypt the new message
    const secretKey = process.env.MESSAGE_SECRET_KEY;
    const encryptedMessage = encryptMessage(newMessage, secretKey);

    // Update message in Firestore
    await admin.firestore().collection('conversations').doc(conversationId).collection('messages').doc(messageId).update({
      message: encryptedMessage,
      editedAt: new Date(),
    });

    // Update message in Realtime Database
    const messageRef = admin.database().ref(`/conversations/${conversationId}/messages`).orderByChild('messageId').equalTo(messageId);
    const snapshot = await messageRef.once('value');
    snapshot.forEach(childSnapshot => {
      childSnapshot.ref.update({
        message: encryptedMessage,
        editedAt: new Date().toISOString(),
      });
    });

    res.status(200).json({ message: 'Message edited successfully' });
  } catch (error) {
    next(ApiError.internal('Error editing message', error.message));
  }
};

// Delete a Message (Soft Delete)
exports.deleteMessage = async (req, res, next) => {
  const { conversationId, messageId } = req.body;

  try {
    // Soft delete by marking the message as deleted in Firestore
    await admin.firestore().collection('conversations').doc(conversationId).collection('messages').doc(messageId).update({
      deleted: true,
      deletedAt: new Date(),
    });

    // Soft delete the message in Realtime Database
    const messageRef = admin.database().ref(`/conversations/${conversationId}/messages`).orderByChild('messageId').equalTo(messageId);
    const snapshot = await messageRef.once('value');
    snapshot.forEach(childSnapshot => {
      childSnapshot.ref.update({
        deleted: true,
        deletedAt: new Date().toISOString(),
      });
    });

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    next(ApiError.internal('Error deleting message', error.message));
  }
};

// Self-Destructing Messages (Scheduled Cleanup)
exports.cleanupSelfDestructingMessages = async () => {
  try {
    const now = Date.now();

    const conversationsSnapshot = await admin.firestore().collection('conversations').get();
    const conversations = conversationsSnapshot.docs.map(doc => doc.id);

    // Iterate through all conversations and clean up self-destructing messages
    for (const conversationId of conversations) {
      const messagesSnapshot = await admin.firestore().collection('conversations').doc(conversationId).collection('messages').where('selfDestructTime', '<=', now).get();

      messagesSnapshot.forEach(async (doc) => {
        await admin.firestore().collection('conversations').doc(conversationId).collection('messages').doc(doc.id).delete();
        const messageRef = admin.database().ref(`/conversations/${conversationId}/messages`).orderByChild('messageId').equalTo(doc.id);
        const snapshot = await messageRef.once('value');
        snapshot.forEach(childSnapshot => {
          childSnapshot.ref.remove();
        });
      });
    }
    console.log('Self-destructing messages cleaned up');
  } catch (error) {
    console.error('Error cleaning up self-destructing messages:', error);
  }
};

// Update Read Receipts for a Conversation
exports.updateReadReceipts = async (req, res, next) => {
  const { conversationId, userId } = req.body;

  try {
    await admin.database().ref(`/conversations/${conversationId}/readReceipts/${userId}`).set({
      readAt: new Date().toISOString(),
    });

    res.status(200).json({ message: 'Read receipts updated successfully' });
  } catch (error) {
    next(ApiError.internal('Error updating read receipts', error.message));
  }
};

// Typing Indicator
exports.typingIndicator = async (req, res, next) => {
  const { conversationId, userId, isTyping } = req.body;

  try {
    await admin.database().ref(`/conversations/${conversationId}/typingIndicators/${userId}`).set({
      isTyping,
      timestamp: new Date().toISOString(),
    });

    res.status(200).json({ message: 'Typing indicator updated successfully' });
  } catch (error) {
    next(ApiError.internal('Error updating typing indicator', error.message));
  }
};

// Upload and Send Image
exports.uploadAndSendImage = async (req, res, next) => {
  const { conversationId, senderId } = req.body;
  const file = req.file;

  if (!file) {
    return next(ApiError.badRequest('No file uploaded'));
  }

  try {
    const bucket = admin.storage().bucket();
    const fileName = `message_images/${conversationId}_${Date.now()}`;
    const fileUpload = bucket.file(fileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (error) => {
      next(ApiError.internal('Error uploading image', error.message));
    });

    blobStream.on('finish', async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
      const newMessage = await admin.firestore().collection('conversations').doc(conversationId).collection('messages').add({
        senderId,
        imageUrl: publicUrl,
        sentAt: new Date(),
      });

      const messageData = {
        messageId: newMessage.id,
        senderId,
        imageUrl: publicUrl,
        sentAt: new Date().toISOString(),
      };

      await admin.database().ref(`/conversations/${conversationId}/messages`).push(messageData);

      res.status(201).json({ message: 'Image uploaded and message sent successfully', messageId: newMessage.id, imageUrl: publicUrl });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    next(ApiError.internal('Error uploading image', error.message));
  }
};
