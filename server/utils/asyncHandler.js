'use strict';

/**
 * Wraps an async route handler so any thrown error is forwarded to next()
 * instead of causing an unhandled promise rejection.
 *
 * @param  {Function} fn  Async (req, res, next) => Promise
 * @returns {Function}    Express middleware
 */
module.exports = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
