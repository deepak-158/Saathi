const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { analyzeMessage } = require('../src/services/safetyService');

describe('Safety Service Tests', () => {
  test('should detect crisis in self-harm and suicide thoughts', () => {
    const triggerCases = [
      'I want to end my life, I cannot take this anymore',
      'Thinking of suicide because of placement rejection',
      'I want to kill myself, the pressure is too much',
      'I want to hurt myself',
    ];

    for (const phrase of triggerCases) {
      const result = analyzeMessage(phrase);
      assert.equal(result.level, 'crisis', `Expected crisis level for: "${phrase}"`);
      assert.ok(result.addSafetyContext.includes('CRITICAL SAFETY INSTRUCTION'));
      assert.ok(result.addSafetyContext.includes('Vandrevala'));
    }
  });

  test('should detect distress in severe overwhelm phrases', () => {
    const distressCases = [
      'I am feeling completely depressed and broken down',
      'I feel worthless and nobody cares about me',
      'I am having a panic attack right now',
    ];

    for (const phrase of distressCases) {
      const result = analyzeMessage(phrase);
      assert.equal(result.level, 'distress', `Expected distress level for: "${phrase}"`);
      assert.ok(result.addSafetyContext.includes('SAFETY NOTE'));
    }
  });

  test('should mark normal academic questions as safe', () => {
    const safeCases = [
      'Can you explain the knapsack problem in dynamic programming?',
      'How to clear my operating systems exam on Thursday?',
      'Review my resume points for Google SDE role',
    ];

    for (const phrase of safeCases) {
      const result = analyzeMessage(phrase);
      assert.equal(result.level, 'safe', `Expected safe level for: "${phrase}"`);
      assert.equal(result.addSafetyContext, null);
    }
  });
});
