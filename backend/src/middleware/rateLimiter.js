const rateLimit = require('express-rate-limit');
const Usage = require('../models/Usage');
const env = require('../config/env');
const { getTodayUTC } = require('../utils/helpers');
const logger = require('../utils/logger');

// IP-based rate limiter for all API routes
const ipLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again in a moment.',
  },
});

// Stricter IP limiter for AI chat routes
const aiIpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many AI requests. Please wait a moment before trying again.',
  },
});

// Per-user AI rate limiter (checks MongoDB usage)
const userAiLimiter = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const today = getTodayUTC();

    const usage = await Usage.findOne({ userId, date: today });

    if (usage) {
      // Check per-minute limit (approximate with last minute tracking)
      // We use a simpler daily check here; IP limiter handles minute-level
      if (usage.requests >= env.userDailyAiLimit) {
        return res.status(429).json({
          success: false,
          message: `You've reached your daily AI limit of ${env.userDailyAiLimit} requests. Your limit resets tomorrow.`,
          retryAfter: 'tomorrow',
        });
      }
    }

    // Check global daily limit
    const globalUsage = await Usage.aggregate([
      { $match: { date: today } },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: '$requests' },
          totalTokens: { $sum: '$totalTokens' },
        },
      },
    ]);

    if (globalUsage.length > 0) {
      const { totalRequests, totalTokens } = globalUsage[0];

      if (totalRequests >= env.globalDailyRequestLimit) {
        logger.warn('Global daily request limit reached');
        return res.status(429).json({
          success: false,
          message: 'The companion is taking a break for today. Please try again tomorrow.',
        });
      }

      if (totalTokens >= env.globalDailyTokenLimit) {
        logger.warn('Global daily token limit reached');
        return res.status(429).json({
          success: false,
          message: 'The companion is taking a break for today. Please try again tomorrow.',
        });
      }
    }

    next();
  } catch (error) {
    logger.error('Rate limiter error:', error.message);
    // Don't block the user on rate limiter errors; fail open but log
    next();
  }
};

module.exports = { ipLimiter, aiIpLimiter, userAiLimiter };
