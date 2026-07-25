const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// Helper to generate token and set cookie
const generateTokenAndSetCookie = (res, adminId) => {
  const token = jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('jwt', token, {
    httpOnly: true, // Prevent XSS
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    // 'none' is required for cross-domain cookies (e.g., Vercel frontend to Render backend)
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (admin && (await admin.comparePassword(password))) {
      generateTokenAndSetCookie(res, admin._id);

      return successResponse(res, {
        admin: { email: admin.email }
      }, 'Logged in successfully');
    } else {
      return errorResponse(res, 'Invalid email or password', 401);
    }
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 'Server error', 500);
  }
};

// @desc    Logout admin / clear cookie
// @route   POST /api/auth/logout
// @access  Public
exports.logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
  return successResponse(res, null, 'Logged out successfully');
};

// @desc    Get current logged in admin
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (admin) {
      return successResponse(res, admin);
    } else {
      return errorResponse(res, 'Admin not found', 404);
    }
  } catch (error) {
    return errorResponse(res, 'Server error', 500);
  }
};
