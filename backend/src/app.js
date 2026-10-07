const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const env = require('./config/env');
const { ipLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const chatRoutes = require('./routes/chatRoutes');
const memoryRoutes = require('./routes/memoryRoutes');
const goalRoutes = require('./routes/goalRoutes');
const checkinRoutes = require('./routes/checkinRoutes');
const { getUserUsage, getUserUsageHistory } = require('./services/usageService');
const { protect } = require('./middleware/authMiddleware');
const { asyncHandler, apiResponse } = require('./utils/helpers');

const app = express();

// Security
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS - Supports multiple origins and AWS Amplify domains
const allowedOrigins = env.clientUrl
  ? env.clientUrl.split(',').map((u) => u.trim().replace(/\/+$/, ''))
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin || 
      allowedOrigins.includes(origin) || 
      (env.nodeEnv === 'development' && origin.includes('localhost')) ||
      origin.endsWith('.amplifyapp.com')
    ) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Logging
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Global rate limiter
app.use('/api', ipLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Saathi API is running', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', chatRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/checkins', checkinRoutes);

// Usage route
app.get('/api/usage', protect, asyncHandler(async (req, res) => {
  const [today, history] = await Promise.all([
    getUserUsage(req.user._id),
    getUserUsageHistory(req.user._id, 7),
  ]);
  return apiResponse(res, 200, { today, history });
}));

// 404 and error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
