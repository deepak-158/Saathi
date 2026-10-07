const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { buildContext } = require('../services/contextService');
const { chatCompletion, chatCompletionStream } = require('../services/groqService');
const { recordUsage } = require('../services/usageService');
const { processMemoryExtraction } = require('../services/memoryService');
const { summarizeConversation } = require('../services/summaryService');
const { analyzeMessage } = require('../services/safetyService');
const { asyncHandler, apiResponse, truncate } = require('../utils/helpers');
const logger = require('../utils/logger');

const SUMMARY_THRESHOLD = 20; // Summarize after this many messages
const MEMORY_EXTRACTION_INTERVAL = 7; // Extract memories every N messages

// POST /api/chat — Main chat endpoint with streaming
const sendMessage = asyncHandler(async (req, res) => {
  const { message, conversationId, mode = 'talk' } = req.body;
  const userId = req.user._id;

  // Safety check
  const safety = analyzeMessage(message);

  // Get or create conversation
  let conversation;
  if (conversationId) {
    conversation = await Conversation.findOne({ _id: conversationId, userId });
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }
    if (mode && conversation.mode !== mode) {
      conversation.mode = mode;
      await conversation.save();
    }
  } else {
    conversation = await Conversation.create({
      userId,
      mode: mode || 'talk',
      title: truncate(message, 60),
    });
  }

  // Save user message
  const userMessage = await Message.create({
    conversationId: conversation._id,
    userId,
    role: 'user',
    content: message,
  });

  // Build context
  const contextMessages = await buildContext({
    user: req.user,
    conversationId: conversation._id,
    conversation,
    currentMessage: message,
    mode: conversation.mode,
  });

  // Inject safety context if needed
  if (safety.addSafetyContext) {
    contextMessages[0].content += `\n\n${safety.addSafetyContext}`;
  }

  // Set up SSE streaming
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Conversation-Id': conversation._id.toString(),
  });

  // Send conversation ID as first event
  res.write(`data: ${JSON.stringify({ type: 'meta', conversationId: conversation._id, mode: conversation.mode })}\n\n`);

  let fullResponse = '';
  let tokenUsage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

  try {
    const stream = await chatCompletionStream(contextMessages);

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || '';
      if (delta) {
        fullResponse += delta;
        res.write(`data: ${JSON.stringify({ type: 'chunk', content: delta })}\n\n`);
      }

      // Capture usage from the last chunk
      if (chunk.x_groq?.usage) {
        tokenUsage = chunk.x_groq.usage;
      }
      if (chunk.usage) {
        tokenUsage = chunk.usage;
      }
    }
  } catch (streamError) {
    logger.error('Streaming error:', streamError.message);

    // If stream failed before producing any content, try a non-streaming fallback
    if (!fullResponse) {
      try {
        logger.info('Attempting non-streaming fallback...');
        const fallbackResult = await chatCompletion(contextMessages);
        fullResponse = fallbackResult.content;
        tokenUsage = fallbackResult.usage;
        res.write(`data: ${JSON.stringify({ type: 'chunk', content: fullResponse })}\n\n`);
      } catch (fallbackError) {
        logger.error('Non-streaming fallback also failed:', fallbackError.message);
        const errorMsg = fallbackError.statusCode === 429
          ? 'The companion is taking a short break. Please try again in a moment.'
          : 'Something went wrong. Please try again.';
        res.write(`data: ${JSON.stringify({ type: 'error', message: errorMsg })}\n\n`);
        res.write('data: [DONE]\n\n');
        return res.end();
      }
    }
    // If we had partial content from the stream, continue with what we have
  }

  // Save assistant message
  const assistantMessage = await Message.create({
    conversationId: conversation._id,
    userId,
    role: 'assistant',
    content: fullResponse,
  });

  // Update conversation metadata
  conversation.messageCount += 2; // user + assistant
  conversation.lastMessageAt = new Date();

  // Auto-generate title from first message
  if (conversation.messageCount <= 2) {
    conversation.title = truncate(message, 60);
  }

  await conversation.save();

  // Record usage
  await recordUsage(userId, tokenUsage);

  // Background tasks: memory extraction and summarization
  // Don't await — fire and forget
  handleBackgroundTasks(userId, conversation).catch((err) =>
    logger.error('Background task error:', err.message)
  );

  // Send completion event
  res.write(`data: ${JSON.stringify({ type: 'done', messageId: assistantMessage._id })}\n\n`);
  res.write('data: [DONE]\n\n');
  res.end();
});

/**
 * Handle memory extraction and conversation summarization in the background.
 */
async function handleBackgroundTasks(userId, conversation) {
  const messageCount = conversation.messageCount;

  // Memory extraction every N messages
  if (messageCount % MEMORY_EXTRACTION_INTERVAL === 0) {
    const recentMsgs = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: -1 })
      .limit(MEMORY_EXTRACTION_INTERVAL * 2)
      .lean();

    const result = await processMemoryExtraction(userId, recentMsgs.reverse());
    if (result.usage) {
      await recordUsage(userId, result.usage);
    }
  }

  // Conversation summarization when message count crosses threshold
  if (messageCount >= SUMMARY_THRESHOLD && messageCount - conversation.lastSummarizedAt >= SUMMARY_THRESHOLD) {
    const olderMessages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .limit(messageCount - 10) // Summarize all but the last 10
      .lean();

    const { summary, usage } = await summarizeConversation(olderMessages, conversation.summary);
    conversation.summary = summary;
    conversation.lastSummarizedAt = messageCount;
    await conversation.save();

    if (usage) {
      await recordUsage(userId, usage);
    }
  }
}

// GET /api/conversations
const getConversations = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [conversations, total] = await Promise.all([
    Conversation.find({ userId: req.user._id })
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Conversation.countDocuments({ userId: req.user._id }),
  ]);

  return apiResponse(res, 200, {
    conversations,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// GET /api/conversations/:id
const getConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!conversation) {
    return res.status(404).json({ success: false, message: 'Conversation not found.' });
  }

  return apiResponse(res, 200, { conversation });
});

// DELETE /api/conversations/:id
const deleteConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!conversation) {
    return res.status(404).json({ success: false, message: 'Conversation not found.' });
  }

  await Message.deleteMany({ conversationId: conversation._id });
  await conversation.deleteOne();

  return apiResponse(res, 200, null, 'Conversation deleted.');
});

// PATCH /api/conversations/:id
const updateConversation = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const conversation = await Conversation.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { title },
    { new: true }
  );

  if (!conversation) {
    return res.status(404).json({ success: false, message: 'Conversation not found.' });
  }

  return apiResponse(res, 200, { conversation });
});

// GET /api/conversations/:id/messages
const getMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!conversation) {
    return res.status(404).json({ success: false, message: 'Conversation not found.' });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Message.countDocuments({ conversationId: conversation._id }),
  ]);

  return apiResponse(res, 200, {
    messages,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

module.exports = {
  sendMessage,
  getConversations,
  getConversation,
  deleteConversation,
  updateConversation,
  getMessages,
};
