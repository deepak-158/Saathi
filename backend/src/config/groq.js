const Groq = require('groq-sdk');
const env = require('./env');

const groqClient = new Groq({
  apiKey: env.groqApiKey,
});

module.exports = groqClient;
