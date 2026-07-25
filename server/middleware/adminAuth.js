const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { errorResponse } = require('../utils/apiResponse');

module.exports = async (req, res, next) => {
  let token;

  // Check if token exists in cookies
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return errorResponse(res, 'Not authorized, no token', 401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach admin to request (without password)
    req.admin = await Admin.findById(decoded.id).select('-password');
    
    if (!req.admin) {
      return errorResponse(res, 'Not authorized, admin not found', 401);
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return errorResponse(res, 'Not authorized, token failed', 401);
  }
};
