'use strict';

const { Schema, model } = require('mongoose');

const BUDGET_RANGES = ['<1k', '1k-5k', '5k-10k', '>10k'];
const STATUSES      = ['New', 'Contacted', 'Closed'];

const LeadSchema = new Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Please provide a valid email address',
      ],
    },
    budgetRange: {
      type:     String,
      required: [true, 'Budget range is required'],
      enum: {
        values:  BUDGET_RANGES,
        message: `Budget range must be one of: ${BUDGET_RANGES.join(', ')}`,
      },
    },
    message: {
      type:      String,
      required:  [true, 'Message is required'],
      trim:      true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    status: {
      type:    String,
      enum:    STATUSES,
      default: 'New',
    },
  },
  { timestamps: true }
);

// Index for admin search queries
LeadSchema.index({ name: 'text', email: 'text' });

module.exports = model('Lead', LeadSchema);
