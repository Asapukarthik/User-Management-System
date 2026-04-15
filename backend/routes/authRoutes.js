// Authentication Routes
const express = require('express');
const router = express.Router();
const { register, login, refreshAccessToken, logout } = require('../controllers/authController');
const { authorize: authMiddleware } = require('../middleware/authMiddleware');
const { 
  registerValidationRules, 
  loginValidationRules, 
  validate 
} = require('../middleware/validation');

router.post('/register', registerValidationRules(), validate, register);
router.post('/login', loginValidationRules(), validate, login);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', authMiddleware, logout);

module.exports = router;
