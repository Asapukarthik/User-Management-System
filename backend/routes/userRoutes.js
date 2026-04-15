const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, getUser, updateUser, deleteUser, restoreUser, approveUser } = require('../controllers/userController');
const { authorize: authMiddleware } = require('../middleware/authMiddleware');
const { authorize: roleMiddleware } = require('../middleware/roleMiddleware');
const { userValidationRules, createUserValidationRules, validate } = require('../middleware/validation');

// All routes require authentication
router.use(authMiddleware);

// Routes
router.get('/', roleMiddleware('admin', 'manager'), getAllUsers);
router.post('/', roleMiddleware('admin', 'manager'), createUserValidationRules(), validate, createUser);
router.get('/:id', getUser);
router.put('/:id', userValidationRules(), validate, updateUser);
router.delete('/:id', roleMiddleware('admin'), deleteUser);
router.patch('/:id/restore', roleMiddleware('admin'), restoreUser);
router.patch('/:id/approve', roleMiddleware('admin'), approveUser);

module.exports = router;
