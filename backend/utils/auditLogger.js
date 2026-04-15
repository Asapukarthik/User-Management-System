const AuditLog = require('../models/AuditLog');

/**
 * Log a system action to the AuditLog collection
 * 
 * @param {Object} options 
 * @param {string} options.action - Action name (e.g., 'LOGIN_SUCCESS')
 * @param {string} options.actorId - User ID of the person performing the action
 * @param {string} options.targetId - ID of the target resource (e.g., affected user ID)
 * @param {Object} options.details - Additional context/data
 * @param {string} options.status - 'success' or 'failure'
 * @param {Object} req - Express request object to extract IP
 */
const logAction = async ({ action, actorId, targetId, details = {}, status = 'success' }, req = null) => {
  try {
    const targetString = targetId ? String(targetId) : '';
    const logData = {
      action,
      actor: actorId || (req?.user ? req.user.id : null),
      target: targetId,
      targetRef: targetString.match(/^[0-9a-fA-F]{24}$/) ? targetString : null,
      details,
      status,
      ip: req ? req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress : null,
    };

    await AuditLog.create(logData);
  } catch (error) {
    console.error('Audit Log Error:', error);
    // We don't throw error to avoid breaking the main process if logging fails
  }
};

module.exports = { logAction };
