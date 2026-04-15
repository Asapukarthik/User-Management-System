// Profile Routes
const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword } = require('../controllers/profileController');
const { authorize: authMiddleware } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.get('/', getProfile);
router.put('/', updateProfile);
router.put('/change-password', changePassword);

module.exports = router;
