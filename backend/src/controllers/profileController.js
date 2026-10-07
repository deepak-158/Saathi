const User = require('../models/User');
const { asyncHandler, apiResponse } = require('../utils/helpers');

// GET /api/profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return apiResponse(res, 200, { user });
});

// PATCH /api/profile
const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    'name', 'college', 'degree', 'branch', 'year',
    'graduationYear', 'cgpa', 'careerGoal', 'skills',
    'interests', 'onboardingComplete', 'preferences',
  ];

  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      if (field === 'cgpa') {
        updates.cgpa = (req.body.cgpa === '' || req.body.cgpa === null || isNaN(req.body.cgpa)) 
          ? null 
          : Number(req.body.cgpa);
      } else if (field === 'graduationYear') {
        updates.graduationYear = (req.body.graduationYear === '' || req.body.graduationYear === null || isNaN(req.body.graduationYear)) 
          ? null 
          : Number(req.body.graduationYear);
      } else {
        updates[field] = req.body[field];
      }
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  return apiResponse(res, 200, { user }, 'Profile updated successfully.');
});

module.exports = { getProfile, updateProfile };
