const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const { asyncHandler, apiResponse } = require('../utils/helpers');

const generateToken = (id) => {
  return jwt.sign({ id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
};

const setCookieAndRespond = (res, user, statusCode = 200) => {
  const token = generateToken(user._id);

  res.cookie('token', token, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return apiResponse(res, statusCode, { user, token });
};

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, college, branch, year, degree } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'An account with this email already exists.',
    });
  }

  // Calculate approximate graduationYear if not provided
  let calculatedGradYear = null;
  const currentYear = new Date().getFullYear();
  if (year) {
    const yStr = String(year);
    if (yStr.includes('1')) calculatedGradYear = currentYear + 3;
    else if (yStr.includes('2')) calculatedGradYear = currentYear + 2;
    else if (yStr.includes('3')) calculatedGradYear = currentYear + 1;
    else if (yStr.includes('4')) calculatedGradYear = currentYear;
    else if (yStr.toLowerCase().includes('grad')) calculatedGradYear = currentYear;
  }

  const user = await User.create({
    name,
    email,
    passwordHash: password, // pre-save hook hashes it
    college: college ? college.trim() : '',
    branch: branch ? branch.trim() : '',
    year: year || '',
    degree: degree ? degree.trim() : 'B.Tech',
    graduationYear: calculatedGradYear,
  });

  return setCookieAndRespond(res, user, 201);
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
    });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
    });
  }

  return setCookieAndRespond(res, user);
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  return apiResponse(res, 200, null, 'Logged out successfully.');
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  return apiResponse(res, 200, { user: req.user });
});

module.exports = { register, login, logout, getMe };
