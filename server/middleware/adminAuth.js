'use strict';

/**
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
module.exports = (req, res, next) => {
  const secret = req.headers['x-admin-secret'];

  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: invalid or missing admin secret',
    });
  }

  next();
};
