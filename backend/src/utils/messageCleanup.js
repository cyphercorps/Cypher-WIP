const admin = require('firebase-admin');

// Cleanup function to remove self-destructing messages
const cleanupSelfDestructingMessages = async () => {
  try {
    const now = Date.now();

    // Get all conversations from Firestore
    const conversationsSnapshot = await admin.firestore().collection('conversations').get();
    const conversations = conversationsSnapshot.docs.map(doc => doc.id);

    // Iterate through all conversations and clean up self-destructing messages
    for (const conversationId of conversations) {
      // Fetch self-destructing messages where the self-destruct time has passed
      const messagesSnapshot = await admin.firestore()
        .collection('conversations')
        .doc(conversationId)
        .collection('messages')
        .where('selfDestructTime', '<=', now)
        .get();

      const batch = admin.firestore().batch(); // Batch deletion for Firestore

      // For each message, delete it from Firestore and Realtime Database
      messagesSnapshot.forEach(async (doc) => {
        const messageId = doc.id;

        // Delete from Firestore
        batch.delete(doc.ref);

        // Delete from Realtime Database
        const messageRef = admin.database().ref(`/conversations/${conversationId}/messages`).orderByChild('messageId').equalTo(messageId);
        const snapshot = await messageRef.once('value');
        snapshot.forEach(childSnapshot => {
          childSnapshot.ref.remove();
        });
      });

      // Commit batch delete for Firestore
      await batch.commit();
    }
    console.log('Self-destructing messages cleaned up successfully.');
  } catch (error) {
    console.error('Error cleaning up self-destructing messages:', error);
  }
};

module.exports = { cleanupSelfDestructingMessages };
