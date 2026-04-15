// Manager Routes
const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUser,
} = require('../controllers/managerController');
const { authorize: authMiddleware } = require('../middleware/authMiddleware');
const { authorize: roleMiddleware } = require('../middleware/roleMiddleware');
const { 
  userValidationRules, 
  validate 
} = require('../middleware/validation');

// All routes require authentication and manager/admin role
router.use(authMiddleware);
router.use(roleMiddleware('manager', 'admin'));

router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', userValidationRules(), validate, updateUser);

module.exports = router;
