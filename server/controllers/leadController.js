'use strict';

const Lead          = require('../models/Lead');
const asyncHandler  = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');

/**
 * @desc    Submit a new lead
 * @route   POST /api/leads
 * @access  Public
 */
exports.submitLead = asyncHandler(async (req, res) => {
  const { name, email, budgetRange, message } = req.body;

  const lead = await Lead.create({ name, email, budgetRange, message });

  successResponse(res, lead, 'Thank you! We will be in touch soon.', 201);
});
