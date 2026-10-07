const Usage = require('../models/Usage');
const { getTodayUTC } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * Record AI usage for a user (called after each Groq response).
 */
async function recordUsage(userId, tokenUsage) {
  const today = getTodayUTC();
  const { prompt_tokens = 0, completion_tokens = 0, total_tokens = 0 } = tokenUsage;

  try {
    await Usage.findOneAndUpdate(
      { userId, date: today },
      {
        $inc: {
          requests: 1,
          inputTokens: prompt_tokens,
          outputTokens: completion_tokens,
          totalTokens: total_tokens,
        },
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    logger.error('Failed to record usage:', error.message);
    // Non-critical — don't throw
  }
}

/**
 * Get usage for a user on a given date.
 */
async function getUserUsage(userId, date) {
  const usage = await Usage.findOne({ userId, date: date || getTodayUTC() });
  return usage || { requests: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0 };
}

/**
 * Get usage history for a user over last N days.
 */
async function getUserUsageHistory(userId, days = 7) {
  const dates = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }

  const usage = await Usage.find({ userId, date: { $in: dates } }).sort({ date: -1 });
  return usage;
}

module.exports = { recordUsage, getUserUsage, getUserUsageHistory };
