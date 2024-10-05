// permissionMiddleware.js

const permissionMiddleware = (requiredRole) => {
  return (req, res, next) => {
    const { userId, conversation } = req;

    // Extract roles from the conversation object
    const { owner, admins, participants } = conversation;

    // Check if the user is the owner
    if (requiredRole === 'owner' && userId === owner) {
      return next();
    }

    // Check if the user is an admin and requiredRole allows admins
    if (requiredRole === 'admin' && admins.includes(userId)) {
      return next();
    }

    // Check if the user is a participant and requiredRole allows participants
    if (requiredRole === 'participant' && participants.includes(userId)) {
      return next();
    }

    // If none of the roles match, deny access
    return res.status(403).json({ error: 'Permission denied' });
  };
};

module.exports = permissionMiddleware;