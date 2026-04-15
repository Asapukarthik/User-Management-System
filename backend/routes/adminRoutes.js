// Admin Routes
const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  changeUserRole,
  toggleUserStatus,
  deleteUser,
  getAuditLogs,
} = require('../controllers/adminController');
const { authorize: authMiddleware } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');
const { 
  userValidationRules, 
  registerValidationRules,
  validate 
} = require('../middleware/validation');

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(adminOnly);

// Audit logs
router.get('/audit-logs', getAuditLogs);

router.get('/users', getAllUsers);
router.post('/users', registerValidationRules(), validate, createUser);
router.get('/users/:id', getUser);
router.put('/users/:id', userValidationRules(), validate, updateUser);
router.put('/users/:id/role', changeUserRole);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

module.exports = router;
