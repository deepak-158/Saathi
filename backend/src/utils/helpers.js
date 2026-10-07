/**
 * Wraps an async route handler to catch errors and pass to Express error middleware.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Creates a standardized API response.
 */
const apiResponse = (res, statusCode, data, message = 'Success') => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    message,
    data,
  });
};

/**
 * Get today's date string in YYYY-MM-DD format (UTC).
 */
const getTodayUTC = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Truncate text to a maximum length.
 */
const truncate = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

module.exports = { asyncHandler, apiResponse, getTodayUTC, truncate };
