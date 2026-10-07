const chalk = require !== undefined ? null : null; // Optional colored output

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

function shouldLog(level) {
  return levels[level] <= levels[currentLevel];
}

function formatMessage(level, ...args) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  return [prefix, ...args];
}

const logger = {
  error: (...args) => {
    if (shouldLog('error')) console.error(...formatMessage('error', ...args));
  },
  warn: (...args) => {
    if (shouldLog('warn')) console.warn(...formatMessage('warn', ...args));
  },
  info: (...args) => {
    if (shouldLog('info')) console.log(...formatMessage('info', ...args));
  },
  debug: (...args) => {
    if (shouldLog('debug')) console.log(...formatMessage('debug', ...args));
  },
};

module.exports = logger;
