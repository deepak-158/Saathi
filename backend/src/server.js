const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');
const logger = require('./utils/logger');

const startServer = async () => {
  await connectDB();

  app.listen(env.port, () => {
    logger.info(`Saathi server running on port ${env.port} in ${env.nodeEnv} mode`);
  });
};

startServer().catch((error) => {
  logger.error('Failed to start server:', error.message);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error.message);
  process.exit(1);
});
