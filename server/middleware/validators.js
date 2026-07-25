'use strict';

const { body, validationResult } = require('express-validator');

// ─── Shared error handler ─────────────────────────────────────────────────────
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors:  errors.array().map(({ path, msg }) => ({ field: path, message: msg })),
    });
  }
  next();
};

// ─── Lead submission rules ────────────────────────────────────────────────────
exports.validateLead = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('budgetRange')
    .notEmpty().withMessage('Budget range is required')
    .isIn(['<1k', '1k-5k', '5k-10k', '>10k'])
    .withMessage('Budget range must be one of: <1k, 1k-5k, 5k-10k, >10k'),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),

  handleValidationErrors,
];

// ─── Status update rules (admin) ─────────────────────────────────────────────
exports.validateStatusUpdate = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['New', 'Contacted', 'Closed'])
    .withMessage('Status must be one of: New, Contacted, Closed'),

  handleValidationErrors,
];
