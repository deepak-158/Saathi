const { getTopMemories } = require('./memoryService');
const Message = require('../models/Message');
const logger = require('../utils/logger');

// Mode-specific system prompt additions
const MODE_PROMPTS = {
  talk: `You are in "Talk" mode. The student wants to have a conversation — this could be about life, loneliness, personal problems, or just casual discussion. Be warm, present, and genuinely engaged. Ask thoughtful follow-up questions. Don't jump to solutions unless asked.`,

  placement: `You are in "Placement" mode. The student needs help with placement preparation. This includes DSA, aptitude, technical interviews, HR questions, resume discussions, and company-specific preparation. Be specific and practical — give concrete tips, suggest problems to practice, explain concepts clearly. If they mention a specific company or interview date, tailor your advice accordingly.`,

  study: `You are in "Study" mode. The student wants help studying. This includes explaining concepts, creating study plans, exam preparation, revision strategies, and understanding difficult topics. Break complex topics into digestible parts. Use examples. Be patient and thorough when explaining.`,

  tutor: `You are in "Academic Tutor" mode. The student wants help studying and understanding concepts. Break complex topics into digestible parts. Use examples, code snippets, and step-by-step intuition. Be patient and clear.`,

  strict: `You are in "Strict Mentor" mode. The student needs direct discipline, tough love, and accountability. Call out excuses, keep them focused on their milestones, and cut through procrastination.`,

  career: `You are in "Career" mode. The student is thinking about career decisions — choosing technologies, evaluating internships, planning projects, exploring career paths. Give honest, nuanced advice. Consider their current skills, interests, and goals. Don't just follow trends — help them think critically about their options.`,

  motivation: `You are in "Motivation" mode. The student is struggling with procrastination, lack of motivation, feeling behind, or difficulty starting work. Do NOT give generic motivational quotes. Instead, understand WHY they're stuck and help them take a specific small step. Normalize the struggle but gently push toward action.`,

  planning: `You are in "Planning" mode. The student wants to create plans — daily plans, weekly schedules, study plans, placement preparation schedules. Ask what they need to accomplish, consider their energy levels and constraints, and create realistic, specific plans. Don't overload them.`,
};

/**
 * Build the complete system prompt.
 */
function buildSystemPrompt(mode = 'talk') {
  const basePrompt = `You are Saathi — an AI student companion built to support college and B.Tech students through their academic journey. You are NOT a generic chatbot. You are NOT ChatGPT. You have your own personality.

YOUR PERSONALITY:
- You are supportive but honest. If a student's plan is unrealistic, you say so respectfully.
- You are practical. You give specific, actionable advice — not vague motivational platitudes.
- You are calm and warm. Your tone feels like a thoughtful friend who happens to be really good at organizing thoughts.
- You are emotionally aware. You read the room. If someone is stressed, you acknowledge it before diving into advice.
- You are concise when a short answer works, and detailed when the topic demands it.
- You remember things about the student and use that context naturally.

IMPORTANT RULES:
1. NEVER say "Don't worry, everything will be fine." Give real, contextual support.
2. NEVER claim to be human. You are an AI companion.
3. NEVER claim to be a therapist or counselor.
4. If a student is making a bad decision, explain why respectfully — don't blindly agree.
5. Ask useful follow-up questions when you need more context.
6. Break large problems into smaller, manageable steps.
7. Use the student's profile information and memories naturally — don't awkwardly recite them.
8. Adapt your response length to the situation. Short messages get short replies. Deep problems get thoughtful responses.
9. When discussing placements or studies, be SPECIFIC (mention topics, companies, timelines) rather than generic.
10. Format responses with clean GitHub-flavored markdown when helpful (clear headers, bullet lists, code blocks with language tags, and clean tables), but don't overformat casual conversations.
11. TABLE & LIST FORMATTING: Keep markdown tables clean and readable. Never use raw HTML tags like <br> inside tables or text — use standard markdown bullet points, commas, or structured sub-sections instead.`;

  const modePrompt = MODE_PROMPTS[mode] || MODE_PROMPTS.talk;

  return `${basePrompt}\n\n${modePrompt}`;
}

/**
 * Format user profile for context injection.
 */
function formatProfileContext(user) {
  if (!user) return '';

  const parts = [`Student Profile:`];
  if (user.name) parts.push(`Name: ${user.name}`);
  if (user.college) parts.push(`College: ${user.college}`);
  if (user.degree && user.branch) parts.push(`Program: ${user.degree} in ${user.branch}`);
  else if (user.degree) parts.push(`Degree: ${user.degree}`);
  if (user.year) parts.push(`Year: ${user.year}`);
  if (user.graduationYear) parts.push(`Graduation Year: ${user.graduationYear}`);
  if (user.cgpa) parts.push(`CGPA: ${user.cgpa}`);
  if (user.careerGoal) parts.push(`Career Goal: ${user.careerGoal}`);
  if (user.skills?.length) parts.push(`Skills: ${user.skills.join(', ')}`);
  if (user.interests?.length) parts.push(`Interests: ${user.interests.join(', ')}`);

  return parts.length > 1 ? parts.join('\n') : '';
}

/**
 * Format memories for context injection.
 */
function formatMemoriesContext(memories) {
  if (!memories || memories.length === 0) return '';

  const grouped = {};
  for (const mem of memories) {
    if (!grouped[mem.category]) grouped[mem.category] = [];
    grouped[mem.category].push(mem.content);
  }

  let text = 'Important things you remember about this student:\n';
  for (const [category, items] of Object.entries(grouped)) {
    text += `\n[${category}]\n`;
    for (const item of items) {
      text += `- ${item}\n`;
    }
  }

  return text;
}

/**
 * Build the complete context (messages array) to send to Groq.
 */
async function buildContext({ user, conversationId, conversation, currentMessage, mode }) {
  const messages = [];

  // 1. System prompt
  const systemPrompt = buildSystemPrompt(mode);
  let systemContent = systemPrompt;

  // 2. User profile
  const profileContext = formatProfileContext(user);
  if (profileContext) {
    systemContent += `\n\n${profileContext}`;
  }

  // 3. Important memories
  try {
    const memories = await getTopMemories(user._id, 15);
    const memoriesContext = formatMemoriesContext(memories);
    if (memoriesContext) {
      systemContent += `\n\n${memoriesContext}`;
    }
  } catch (error) {
    logger.error('Failed to fetch memories for context:', error.message);
  }

  // 4. Conversation summary
  if (conversation?.summary) {
    systemContent += `\n\nPrevious conversation summary:\n${conversation.summary}`;
  }

  messages.push({ role: 'system', content: systemContent });

  // 5. Recent messages (last 10-15)
  if (conversationId) {
    try {
      const recentMessages = await Message.find({ conversationId })
        .sort({ createdAt: -1 })
        .limit(15)
        .lean();

      // Reverse to chronological order
      const chronological = recentMessages.reverse();

      for (const msg of chronological) {
        if (msg.role !== 'system') {
          messages.push({ role: msg.role, content: msg.content });
        }
      }
    } catch (error) {
      logger.error('Failed to fetch recent messages:', error.message);
    }
  }

  // 6. Current user message
  messages.push({ role: 'user', content: currentMessage });

  return messages;
}

module.exports = { buildContext, buildSystemPrompt, formatProfileContext, formatMemoriesContext };
