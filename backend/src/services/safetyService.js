const logger = require('../utils/logger');

const CRISIS_PATTERNS = [
  /\b((?:suicide|suicidal)|kill\s*my\s*self|end\s*(my|it\s*all)|want\s*to\s*die|don'?t\s*want\s*to\s*live|self[- ]?harm)\b/i,
  /\b(hurt\s*my\s*self|cut\s*my\s*self|overdose)\b/i,
];

const DISTRESS_PATTERNS = [
  /\b(depressed|depression|hopeless|worthless|nobody\s*cares|all\s*alone|give\s*up)\b/i,
  /\b(panic\s*attack|can'?t\s*breathe|can'?t\s*take\s*it|breaking\s*down)\b/i,
  /\b(no\s*point|no\s*reason\s*to|nothing\s*matters)\b/i,
];

/**
 * Analyze message for safety concerns.
 * Returns: { level: 'safe'|'distress'|'crisis', addSafetyContext: string|null }
 */
function analyzeMessage(content) {
  if (!content || typeof content !== 'string') {
    return { level: 'safe', addSafetyContext: null };
  }

  // Check for crisis patterns first
  for (const pattern of CRISIS_PATTERNS) {
    if (pattern.test(content)) {
      logger.warn('Crisis-level message detected');
      return {
        level: 'crisis',
        addSafetyContext: getCrisisInstruction(),
      };
    }
  }

  // Check for distress patterns
  for (const pattern of DISTRESS_PATTERNS) {
    if (pattern.test(content)) {
      return {
        level: 'distress',
        addSafetyContext: getDistressInstruction(),
      };
    }
  }

  return { level: 'safe', addSafetyContext: null };
}

function getCrisisInstruction() {
  return `CRITICAL SAFETY INSTRUCTION: The user may be expressing thoughts of self-harm or crisis. 

Your response MUST:
1. Acknowledge their pain with genuine empathy - do not dismiss or minimize
2. Express that you care and are here to listen
3. Gently encourage them to reach out to a trusted person (friend, family member, teacher, counselor)
4. Provide these crisis resources:
   - iCall: 9152987821 (Mon-Sat, 8am-10pm)
   - Vandrevala Foundation: 1860-2662-345 (24/7)
   - AASRA: 9820466726 (24/7)
5. Remind them that professional help is available and there is no shame in seeking it
6. Do NOT provide any harmful information
7. Do NOT play therapist or diagnose - simply listen, support, and direct to professionals
8. Say explicitly: "I'm an AI companion, not a counselor, but I genuinely want you to get the support you deserve."
9. Keep the response warm, calm, and non-judgmental`;
}

function getDistressInstruction() {
  return `SAFETY NOTE: The user appears to be experiencing significant emotional distress.

Your response should:
1. Acknowledge their feelings without minimizing them
2. Listen and understand their situation
3. Provide practical, grounded support
4. Gently suggest talking to someone they trust if appropriate
5. Do NOT diagnose any conditions
6. Do NOT say "everything will be fine" — be genuine
7. Focus on what they can do right now as a small step
8. If the conversation deepens to crisis level, encourage professional support
9. Remember: You are a supportive companion, not a therapist`;
}

module.exports = { analyzeMessage };
