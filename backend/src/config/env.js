const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  groqApiKey: process.env.GROQ_API_KEY,
  groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  userMinuteAiLimit: parseInt(process.env.USER_MINUTE_AI_LIMIT, 10) || 10,
  userDailyAiLimit: parseInt(process.env.USER_DAILY_AI_LIMIT, 10) || 100,
  globalDailyRequestLimit: parseInt(process.env.GLOBAL_DAILY_REQUEST_LIMIT, 10) || 5000,
  globalDailyTokenLimit: parseInt(process.env.GLOBAL_DAILY_TOKEN_LIMIT, 10) || 2000000,
};

// Validate critical env vars in production
const requiredInProduction = ['MONGO_URI', 'JWT_SECRET', 'GROQ_API_KEY'];
if (env.nodeEnv === 'production') {
  for (const key of requiredInProduction) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

module.exports = env;
