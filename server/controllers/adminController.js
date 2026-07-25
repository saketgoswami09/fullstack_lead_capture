'use strict';

const Lead         = require('../models/Lead');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc    Get all leads with optional search and pagination
 * @route   GET /api/admin/leads?search=&page=&limit=
 * @access  Private (admin)
 */
exports.getAllLeads = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 10 } = req.query;

  const pageNum  = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip     = (pageNum - 1) * limitNum;

  // Build query — search across name and email (case-insensitive)
  const query = search
    ? {
        $or: [
          { name:  { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  const [leads, total] = await Promise.all([
    Lead.find(query)
      .sort({ createdAt: -1 })   // newest first
      .skip(skip)
      .limit(limitNum)
      .select('-__v'),
    Lead.countDocuments(query),
  ]);

  successResponse(res, {
    leads,
    pagination: {
      total,
      page:       pageNum,
      limit:      limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

/**
 * @desc    Update a lead's status
 * @route   PATCH /api/admin/leads/:id/status
 * @access  Private (admin)
 */
exports.updateLeadStatus = asyncHandler(async (req, res) => {
  const { id }     = req.params;
  const { status } = req.body;

  const lead = await Lead.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).select('-__v');

  if (!lead) {
    return errorResponse(res, 'Lead not found', 404);
  }

  successResponse(res, lead, `Lead status updated to "${status}"`);
});
