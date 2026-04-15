// Authentication Controller
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { logAction } = require('../utils/auditLogger');

// Generate JWT Access Token
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || '1d',
  });
};

// @desc    Register User
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, username, email, password, passwordConfirm } = req.body;

    // Validate input
    if (!name || !email || !password || !passwordConfirm) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled' });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const query = [{ email }];
    if (username) query.push({ username });

    const existingUser = await User.findOne({ $or: query });

    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      return res.status(400).json({ success: false, message: `${field} already in use` });
    }

    const userData = {
      name,
      email,
      password,
      role: 'user', // Default role for new users
      isActive: false, // Inactive until approved
      needsApproval: true, // Needs admin approval
    };

    if (username) userData.username = username;

    const user = await User.create(userData);

    const accessToken = generateAccessToken(user._id);
    const refreshToken = user.generateRefreshToken();
    await user.save();

    await logAction({
      action: 'USER_REGISTERED',
      actorId: user._id,
      details: { email: user.email },
    }, req);

    res.status(201).json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login User (Email or Username)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    // Validate input
    if ((!email && !username) || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email/username and password' 
      });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: email || null }, { username: username || null }],
    });

    if (!user) {
      await logAction({
        action: 'LOGIN_FAILURE',
        details: { identifier: email || username, reason: 'User not found' },
        status: 'failure',
      }, req);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      const reason = user.needsApproval ? 'Account pending approval' : 'Account deactivated';
      await logAction({
        action: 'LOGIN_FAILURE',
        actorId: user._id,
        details: { reason },
        status: 'failure',
      }, req);
      return res.status(403).json({ success: false, message: `Your account is ${reason.toLowerCase()}` });
    }

    // Verify password
    const passwordMatch = await user.matchPassword(password);
    if (!passwordMatch) {
      await logAction({
        action: 'LOGIN_FAILURE',
        actorId: user._id,
        details: { reason: 'Invalid password' },
        status: 'failure',
      }, req);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    
    const accessToken = generateAccessToken(user._id);
    const refreshToken = user.generateRefreshToken();
    
    await user.save();

    await logAction({
      action: 'LOGIN_SUCCESS',
      actorId: user._id,
    }, req);

    res.status(200).json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh-token
// @access  Public
exports.refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token is required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if refresh token exists in user's tokens
    const tokenExists = user.refreshTokens.find(t => t.token === refreshToken);
    if (!tokenExists) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Refresh token has expired' });
    }
    next(error);
  }
};

// @desc    Logout User
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const user = req.user;

    if (refreshToken) {
      user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
      await user.save();
    }

    await logAction({
      action: 'LOGOUT',
      actorId: user._id,
    }, req);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};
