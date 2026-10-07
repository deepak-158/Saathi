const express = require('express');
const {
  sendMessage,
  getConversations,
  getConversation,
  deleteConversation,
  updateConversation,
  getMessages,
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const { aiIpLimiter, userAiLimiter } = require('../middleware/rateLimiter');
const { validate, chatMessageSchema } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

// Conversations CRUD
router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversation);
router.delete('/conversations/:id', deleteConversation);
router.patch('/conversations/:id', updateConversation);
router.get('/conversations/:id/messages', getMessages);

// Chat endpoint with rate limiting
router.post('/chat', aiIpLimiter, userAiLimiter, validate(chatMessageSchema), sendMessage);

module.exports = router;
