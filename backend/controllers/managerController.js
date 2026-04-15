// Manager Controller - for manager operations
const User = require('../models/User');

// @desc    Get all users (excluding admin)
// @route   GET /api/manager/users
// @access  Private/Manager
exports.getAllUsers = async (req, res, next) => {
  try {
    const { search, role, isActive, sortBy, order } = req.query;
    
    // Build filter - exclude admin users
    let filter = { role: { $ne: 'admin' } };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
      ];
    }

    if (role && role !== 'admin') {
      filter.role = role;
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

// @desc    Get single user (non-admin only)
// @route   GET /api/manager/users/:id
// @access  Private/Manager
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Manager cannot view admin users
    if (user.role === 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'You cannot view admin user details' 
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update non-admin user
// @route   PUT /api/manager/users/:id
// @access  Private/Manager
exports.updateUser = async (req, res, next) => {
  try {
    const { name, username, email, role, isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Manager cannot update admin users
    if (user.role === 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'You cannot update admin user details' 
      });
    }

    // Manager cannot promote to admin
    if (role === 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Managers cannot promote users to admin role' 
      });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (username) user.username = username;
    if (role && role !== 'admin') user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    user.updatedBy = req.user.id;

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};
