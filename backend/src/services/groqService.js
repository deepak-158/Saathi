const groqClient = require('../config/groq');
const env = require('../config/env');
const logger = require('../utils/logger');

// Ordered list of models to try — primary first, then fallbacks
const MODEL_CASCADE = [
  env.groqModel,                    // Primary: openai/gpt-oss-120b
  'compound-beta',                  // Groq compound model
  'qwen/qwen3-32b',                // Fast & reliable
  'llama-3.3-70b-versatile',       // Reliable fallback
  'llama-3.1-8b-instant',          // Ultra-fast small model as last resort
];

const MAX_RETRIES = 2; // retries per model
const BASE_DELAY_MS = 800;

/**
 * Sleep helper
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if an error is retryable (overload / rate-limit / server error).
 */
function isRetryableError(error) {
  const status = error.status || error.statusCode;
  if ([429, 500, 502, 503, 504].includes(status)) return true;
  const msg = (error.message || '').toLowerCase();
  return msg.includes('overloaded') || msg.includes('rate limit') || msg.includes('unavailable') || msg.includes('timeout');
}

/**
 * Send a chat completion to Groq (non-streaming) with retry + fallback.
 */
async function chatCompletion(messages, options = {}) {
  const {
    model,
    temperature = 0.7,
    maxTokens = 2048,
  } = options;

  // If caller specified a model, try only that model (with retries)
  const modelsToTry = model ? [model] : MODEL_CASCADE;

  let lastError = null;

  for (const currentModel of modelsToTry) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        if (attempt > 0 || currentModel !== modelsToTry[0]) {
          logger.info(`Groq attempt ${attempt + 1} with model "${currentModel}"`);
        }

        const response = await groqClient.chat.completions.create({
          model: currentModel,
          messages,
          temperature,
          max_tokens: maxTokens,
        });

        if (currentModel !== modelsToTry[0]) {
          logger.info(`Groq succeeded with fallback model "${currentModel}"`);
        }

        return {
          content: response.choices[0]?.message?.content || '',
          usage: response.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
          finishReason: response.choices[0]?.finish_reason,
          model: currentModel,
        };
      } catch (error) {
        lastError = error;
        logger.warn(`Groq error (model="${currentModel}", attempt=${attempt + 1}): ${error.message}`);

        if (isRetryableError(error) && attempt < MAX_RETRIES) {
          const delay = BASE_DELAY_MS * Math.pow(2, attempt) + Math.random() * 200;
          await sleep(delay);
          continue;
        }

        // Non-retryable error or exhausted retries — try next model
        break;
      }
    }
  }

  // All models exhausted
  if (lastError?.status === 429) {
    throw Object.assign(
      new Error('The companion is taking a short break. Please try again in a moment.'),
      { statusCode: 429 }
    );
  }

  logger.error('All Groq models exhausted:', lastError?.message);
  throw Object.assign(
    new Error('AI service is temporarily unavailable. Please try again.'),
    { statusCode: 502 }
  );
}

/**
 * Send a streaming chat completion to Groq with retry + fallback.
 * Returns an async iterator.
 */
async function chatCompletionStream(messages, options = {}) {
  const {
    model,
    temperature = 0.7,
    maxTokens = 2048,
  } = options;

  const modelsToTry = model ? [model] : MODEL_CASCADE;
  let lastError = null;

  for (const currentModel of modelsToTry) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        if (attempt > 0 || currentModel !== modelsToTry[0]) {
          logger.info(`Groq stream attempt ${attempt + 1} with model "${currentModel}"`);
        }

        const stream = await groqClient.chat.completions.create({
          model: currentModel,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream: true,
        });

        if (currentModel !== modelsToTry[0]) {
          logger.info(`Groq stream succeeded with fallback model "${currentModel}"`);
        }

        return stream;
      } catch (error) {
        lastError = error;
        logger.warn(`Groq stream error (model="${currentModel}", attempt=${attempt + 1}): ${error.message}`);

        if (isRetryableError(error) && attempt < MAX_RETRIES) {
          const delay = BASE_DELAY_MS * Math.pow(2, attempt) + Math.random() * 200;
          await sleep(delay);
          continue;
        }

        break;
      }
    }
  }

  if (lastError?.status === 429) {
    throw Object.assign(
      new Error('The companion is taking a short break. Please try again in a moment.'),
      { statusCode: 429 }
    );
  }

  logger.error('All Groq models exhausted for streaming:', lastError?.message);
  throw Object.assign(
    new Error('AI service is temporarily unavailable. Please try again.'),
    { statusCode: 502 }
  );
}

/**
 * Extract structured JSON from AI response for memory extraction.
 */
async function extractJSON(prompt, options = {}) {
  const response = await chatCompletion(
    [{ role: 'user', content: prompt }],
    { ...options, temperature: 0.3, maxTokens: 1024 }
  );

  // Try to parse JSON from the response
  const content = response.content.trim();
  const jsonMatch = content.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error('No JSON found in AI response');
  }

  return {
    parsed: JSON.parse(jsonMatch[0]),
    usage: response.usage,
  };
}

module.exports = { chatCompletion, chatCompletionStream, extractJSON };
