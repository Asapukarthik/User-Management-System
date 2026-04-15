const { body, validationResult } = require('express-validator');

// Validation result handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(422).json({
    success: false,
    message: 'Validation failed',
    errors: extractedErrors,
  });
};

// User Registration Validation
const registerValidationRules = () => {
  return [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('passwordConfirm').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  ];
};

// Login Validation
const loginValidationRules = () => {
  return [
    body().custom(value => {
      if (!value.email && !value.username) {
        throw new Error('Email or Username is required');
      }
      return true;
    }),
    body('password').notEmpty().withMessage('Password is required'),
  ];
};

// User Creation Validation (Admin/Manager)
const createUserValidationRules = () => {
  return [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['user', 'manager', 'admin']).withMessage('Invalid role'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  ];
};

// User Update Validation (Admin/Manager)
const userValidationRules = () => {
  return [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Email is invalid'),
    body('role').optional().isIn(['user', 'manager', 'admin']).withMessage('Invalid role'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  ];
};

module.exports = {
  validate,
  registerValidationRules,
  loginValidationRules,
  userValidationRules,
  createUserValidationRules,
};
