const mongoose = require('mongoose');
const Groq = require('groq-sdk');
const env = require('../src/config/env');

async function verify() {
  console.log('--- 1. Testing MongoDB Connection ---');
  try {
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ MongoDB connected successfully! Host:', mongoose.connection.host);
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ MongoDB Connection failed:', err.message);
  }

  console.log('\n--- 2. Testing Groq API Key ---');
  try {
    const groq = new Groq({ apiKey: env.groqApiKey });
    const response = await groq.chat.completions.create({
      model: env.groqModel,
      messages: [{ role: 'user', content: 'Say "Saathi is ready!" in 4 words or less.' }],
      max_tokens: 20,
    });
    console.log('✅ Groq API verified! Response:', response.choices[0]?.message?.content);
  } catch (err) {
    console.error('❌ Groq API verification failed:', err.message);
  }
}

verify();
