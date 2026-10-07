const CheckIn = require('../models/CheckIn');
const { asyncHandler, apiResponse } = require('../utils/helpers');

// POST /api/checkins
const createCheckIn = asyncHandler(async (req, res) => {
  const { mood, reason, tags, note } = req.body;

  const checkIn = await CheckIn.create({
    userId: req.user._id,
    mood,
    reason,
    tags: tags || [],
    note,
  });

  return apiResponse(res, 201, { checkIn }, 'Check-in recorded.');
});

// GET /api/checkins
const getCheckIns = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 30;

  const checkIns = await CheckIn.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return apiResponse(res, 200, { checkIns });
});

module.exports = { createCheckIn, getCheckIns };
