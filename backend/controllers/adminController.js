const AuditLog = require('../models/AuditLog');
const User = require('../models/User');
const { logAction } = require('../utils/auditLogger');

// @desc    Get all audit logs
// @route   GET /api/admin/audit-logs
// @access  Private/Admin
exports.getAuditLogs = async (req, res, next) => {
  try {
    const { action, status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (action) filter.action = action;
    if (status) filter.status = status;

    const startIndex = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const total = await AuditLog.countDocuments(filter);
    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(parseInt(limit, 10))
      .populate('actor', 'name email role')
      .populate('targetRef', 'name email');

    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / limit),
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

// --- Standard Admin Actions (Required by adminRoutes.js) ---

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) { next(error); }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (error) { next(error); }
};

exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    await logAction({ action: 'ADMIN_CREATE_USER', targetId: user._id, details: { role: user.role } }, req);
    res.status(201).json({ success: true, data: user });
  } catch (error) { next(error); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await logAction({ action: 'ADMIN_UPDATE_USER', targetId: user._id }, req);
    res.status(200).json({ success: true, data: user });
  } catch (error) { next(error); }
};

exports.changeUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await logAction({ action: 'ADMIN_CHANGE_ROLE', targetId: user._id, details: { newRole: role } }, req);
    res.status(200).json({ success: true, data: user });
  } catch (error) { next(error); }
};

exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    await logAction({ action: 'ADMIN_TOGGLE_STATUS', targetId: user._id, details: { isActive: user.isActive } }, req);
    res.status(200).json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`, data: user });
  } catch (error) { next(error); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    // Perform soft delete logic similar to userController
    const timestamp = Date.now();
    user.email = `__deleted__${timestamp}_${user.email}`;
    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();
    await logAction({ action: 'ADMIN_DELETE_USER', targetId: user._id }, req);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) { next(error); }
};
