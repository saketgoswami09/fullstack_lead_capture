// middleware/adminAuth.js — Simple secret-key guard for /api/admin/*
// Responsibilities: verify x-admin-secret header against ADMIN_SECRET env var

'use strict';

/**
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
// TODO: exports.adminAuth = (req, res, next) => {
//   const secret = req.headers['x-admin-secret'];
//   if (secret !== process.env.ADMIN_SECRET) return res.status(401).json({ message: 'Unauthorized' });
//   next();
// };
