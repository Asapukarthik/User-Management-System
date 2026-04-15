// User Controller
const User = require('../models/User');
const { logAction } = require('../utils/auditLogger');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const { search, role, isActive, isDeleted, needsApproval, sortBy, order } = req.query;
    
    // Build filter
    let filter = { isDeleted: isDeleted === 'true' };

    if (needsApproval !== undefined) {
      filter.needsApproval = needsApproval === 'true';
    }

    // If user is manager, exclude admins
    if (req.user.role === 'manager') {
      filter.role = { $ne: 'admin' };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) {
      // If manager, they can't see admins even if they filter for them
      if (req.user.role === 'manager' && role === 'admin') {
        filter.role = { $ne: 'admin' };
      } else {
        filter.role = role;
      }
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    // Build sort
    let sortOptions = { createdAt: -1 };
    if (sortBy) {
      const sortOrder = order === 'asc' ? 1 : -1;
      sortOptions = { [sortBy]: sortOrder };
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .sort(sortOptions)
      .skip(startIndex)
      .limit(limit)
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name');

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, isActive } = req.body;

    // RBAC: Manager cannot create Admin
    if (req.user.role === 'manager' && role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Managers cannot create admin users',
      });
    }

    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user.id,
    });

    await logAction({
      action: 'USER_CREATED',
      targetId: user._id,
      details: { name: user.name, role: user.role },
    }, req);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false })
      .select('-password')
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Manager cannot view admin
    if (req.user.role === 'manager' && user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, role, isActive } = req.body;
    const user = await User.findOne({ _id: req.params.id, isDeleted: false });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // RBAC checks
    if (req.user.role === 'manager') {
      if (user.role === 'admin' || role === 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    const oldData = { name: user.name, email: user.email, role: user.role, isActive: user.isActive };

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    user.updatedBy = req.user.id;

    await user.save();

    await logAction({
      action: 'USER_UPDATED',
      targetId: user._id,
      details: { 
        changes: Object.keys(req.body).filter(key => req.body[key] !== oldData[key])
      },
    }, req);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isDeleted) {
      return res.status(400).json({ success: false, message: 'User is already deleted' });
    }

    // Soft delete logic:
    // Update email and username to free them up for new records
    const timestamp = Date.now();
    user.email = `__deleted__${timestamp}_${user.email}`;
    if (user.username) {
      user.username = `__deleted__${timestamp}_${user.username}`;
    }
    user.isDeleted = true;
    user.deletedAt = new Date();
    user.updatedBy = req.user.id;
    
    // Clear refresh tokens to force logout
    user.refreshTokens = [];

    await user.save();

    await logAction({
      action: 'USER_DELETED',
      targetId: user._id,
      details: { email: user.email.replace(/^__deleted__\d+_/, '') },
    }, req);

    res.status(200).json({
      success: true,
      message: 'User soft-deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Restore soft-deleted user
// @route   PATCH /api/users/:id/restore
// @access  Private/Admin
exports.restoreUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.isDeleted) {
      return res.status(400).json({ success: false, message: 'User is not deleted' });
    }

    // Restore logic:
    // Try to remove the deletion prefix from email and username
    user.email = user.email.replace(/^__deleted__\d+_/, '');
    if (user.username) {
      user.username = user.username.replace(/^__deleted__\d+_/, '');
    }

    // Check if original email is now taken by someone else
    const emailTaken = await User.findOne({ email: user.email, isDeleted: false });
    if (emailTaken) {
      return res.status(400).json({ 
        success: false, 
        message: 'Original email is now in use. Please update email before restoring.' 
      });
    }

    user.isDeleted = false;
    user.deletedAt = null;
    user.updatedBy = req.user.id;

    await user.save();

    await logAction({
      action: 'USER_RESTORED',
      targetId: user._id,
    }, req);

    res.status(200).json({
      success: true,
      message: 'User restored successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve pending user registration
// @route   PATCH /api/users/:id/approve
// @access  Private/Admin
exports.approveUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.needsApproval) {
      return res.status(400).json({ success: false, message: 'User does not need approval' });
    }

    user.needsApproval = false;
    user.isActive = true;
    user.updatedBy = req.user.id;

    await user.save();

    await logAction({
      action: 'USER_APPROVED',
      targetId: user._id,
    }, req);

    res.status(200).json({
      success: true,
      message: 'User approved successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
