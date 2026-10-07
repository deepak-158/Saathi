const Memory = require('../models/Memory');
const { extractJSON } = require('./groqService');
const logger = require('../utils/logger');

/**
 * Get all memories for a user, sorted by importance.
 */
async function getUserMemories(userId, options = {}) {
  const { category, limit = 50 } = options;
  const query = { userId };
  if (category) query.category = category;

  return Memory.find(query)
    .sort({ importance: -1, updatedAt: -1 })
    .limit(limit);
}

/**
 * Get top N most important memories for context building.
 */
async function getTopMemories(userId, limit = 15) {
  return Memory.find({ userId })
    .sort({ importance: -1, lastUsedAt: -1 })
    .limit(limit);
}

/**
 * Extract memories from recent messages using AI.
 */
async function extractMemories(userId, messages) {
  const conversationText = messages
    .map((m) => `${m.role}: ${m.content}`)
    .join('\n');

  const prompt = `Analyze the following conversation and extract important facts about the user that should be remembered for future conversations.

Focus on:
- Personal information (name details, personal life context)
- Academic information (college, courses, CGPA, subjects)
- Career goals and aspirations
- Placement preparation details (companies, interview dates, weak topics)
- Goals and plans
- Preferences and likes/dislikes
- Current challenges and struggles
- Achievements and accomplishments
- Recurring emotional patterns

Only extract information that would be genuinely useful in future conversations.
Do NOT extract trivial conversational details.

Conversation:
${conversationText}

Respond with ONLY valid JSON in this exact format:
{
  "shouldRemember": true/false,
  "memories": [
    {
      "category": "PERSONAL|ACADEMICS|CAREER|PLACEMENT|GOALS|PREFERENCES|CHALLENGES|ACHIEVEMENTS|EMOTIONAL_CONTEXT",
      "content": "concise fact about the user",
      "importance": 1-10
    }
  ]
}

If there is nothing important to remember, respond with:
{"shouldRemember": false, "memories": []}`;

  try {
    const { parsed, usage } = await extractJSON(prompt);

    if (!parsed.shouldRemember || !Array.isArray(parsed.memories)) {
      return { memories: [], usage };
    }

    // Validate and filter memories
    const validCategories = [
      'PERSONAL', 'ACADEMICS', 'CAREER', 'PLACEMENT',
      'GOALS', 'PREFERENCES', 'CHALLENGES', 'ACHIEVEMENTS', 'EMOTIONAL_CONTEXT',
    ];

    const validMemories = parsed.memories.filter(
      (m) =>
        m.content &&
        m.content.trim().length > 0 &&
        validCategories.includes(m.category) &&
        m.importance >= 1 &&
        m.importance <= 10
    );

    return { memories: validMemories, usage };
  } catch (error) {
    logger.error('Memory extraction failed:', error.message);
    return { memories: [], usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 } };
  }
}

/**
 * Store extracted memories, deduplicating against existing ones.
 */
async function storeMemories(userId, memories, sourceMessageId = null) {
  const stored = [];

  for (const mem of memories) {
    try {
      // Check for similar existing memory
      const existing = await Memory.findOne({
        userId,
        category: mem.category,
        content: { $regex: escapeRegex(mem.content.substring(0, 30)), $options: 'i' },
      });

      if (existing) {
        // Update existing memory if new one has higher importance
        if (mem.importance >= existing.importance) {
          existing.content = mem.content;
          existing.importance = mem.importance;
          existing.lastUsedAt = new Date();
          await existing.save();
          stored.push(existing);
        }
      } else {
        const newMemory = await Memory.create({
          userId,
          category: mem.category,
          content: mem.content,
          importance: mem.importance || 5,
          sourceMessageId,
          lastUsedAt: new Date(),
        });
        stored.push(newMemory);
      }
    } catch (error) {
      logger.error('Failed to store memory:', error.message);
    }
  }

  return stored;
}

/**
 * Process memory extraction for a conversation.
 * Called periodically (e.g., every 5-10 messages).
 */
async function processMemoryExtraction(userId, recentMessages) {
  if (!recentMessages || recentMessages.length < 3) return { stored: [], usage: null };

  const { memories, usage } = await extractMemories(userId, recentMessages);

  if (memories.length === 0) return { stored: [], usage };

  const stored = await storeMemories(userId, memories);
  logger.info(`Extracted and stored ${stored.length} memories for user ${userId}`);

  return { stored, usage };
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = {
  getUserMemories,
  getTopMemories,
  extractMemories,
  storeMemories,
  processMemoryExtraction,
};
