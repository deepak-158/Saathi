const { chatCompletion } = require('./groqService');
const logger = require('../utils/logger');

/**
 * Summarize older messages in a conversation.
 * Preserves important discussion, decisions, goals, and emotional context.
 */
async function summarizeConversation(messages, existingSummary = '') {
  const conversationText = messages
    .map((m) => `${m.role}: ${m.content}`)
    .join('\n');

  const prompt = `You are a conversation summarizer for a student AI companion app.

${existingSummary ? `Previous summary:\n${existingSummary}\n\n` : ''}

Summarize the following conversation, preserving:
- Important discussion topics and conclusions
- Unresolved problems or questions
- Decisions made by the student
- Goals and plans discussed
- Relevant emotional context
- Important actions or commitments
- Upcoming events or deadlines mentioned

Do NOT include:
- Greetings or pleasantries
- Repetitive back-and-forth
- Trivial details

Keep the summary concise but comprehensive (max 500 words).
Write in third person about "the student".

Conversation:
${conversationText}

Summary:`;

  try {
    const response = await chatCompletion(
      [{ role: 'user', content: prompt }],
      { temperature: 0.3, maxTokens: 800 }
    );

    return {
      summary: response.content.trim(),
      usage: response.usage,
    };
  } catch (error) {
    logger.error('Conversation summarization failed:', error.message);
    return { summary: existingSummary, usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 } };
  }
}

module.exports = { summarizeConversation };
