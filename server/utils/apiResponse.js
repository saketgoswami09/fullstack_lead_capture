'use strict';

/**
 * Send a uniform success response.
 *
 * @param {import('express').Response} res
 * @param {*}      data
 * @param {string} [message='Success']
 * @param {number} [statusCode=200]
 */
exports.successResponse = (res, data, message = 'Success', statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });

/**
 * Send a uniform error response.
 *
 * @param {import('express').Response} res
 * @param {string} [message='An error occurred']
 * @param {number} [statusCode=400]
 */
exports.errorResponse = (res, message = 'An error occurred', statusCode = 400) =>
  res.status(statusCode).json({ success: false, message });
