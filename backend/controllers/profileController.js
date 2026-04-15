// Profile Controller - for user profile operations
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile (name and username only)
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, username } = req.body;
    const user = req.user;

    if (!name && !username) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide at least one field to update' 
      });
    }

    if (name) user.name = name;

    if (username) {
      // Check if username is already taken
      const existingUser = await User.findOne({ 
        username: username,
        _id: { $ne: user._id }
      });

      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Username already in use' 
        });
      }

      user.username = username;
    }

    user.updatedBy = user._id;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/profile/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const user = req.user;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'All password fields are required' 
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'New passwords do not match' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'New password must be different from current password' 
      });
    }

    // Verify current password
    const passwordMatch = await user.matchPassword(currentPassword);
    if (!passwordMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Current password is incorrect' 
      });
    }

    // Update password
    user.password = newPassword;
    user.updatedBy = user._id;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};
