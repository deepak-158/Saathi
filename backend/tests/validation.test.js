const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const {
  registerSchema,
  loginSchema,
  chatMessageSchema,
} = require('../src/middleware/validation');
const { truncate, getTodayUTC } = require('../src/utils/helpers');

describe('Validation Schema Tests', () => {
  test('registerSchema accepts valid registration payload', () => {
    const valid = {
      name: 'Aditya Kumar',
      email: 'aditya@example.com',
      password: 'password123',
    };
    const parsed = registerSchema.safeParse(valid);
    assert.equal(parsed.success, true);
  });

  test('registerSchema rejects short passwords and invalid emails', () => {
    const invalid = {
      name: 'A',
      email: 'not-an-email',
      password: '123',
    };
    const parsed = registerSchema.safeParse(invalid);
    assert.equal(parsed.success, false);
  });

  test('loginSchema validates email and password presence', () => {
    const valid = { email: 'student@college.edu', password: 'secretpassword' };
    assert.equal(loginSchema.safeParse(valid).success, true);

    const invalid = { email: '', password: '' };
    assert.equal(loginSchema.safeParse(invalid).success, false);
  });

  test('chatMessageSchema enforces message content limits', () => {
    const valid = { message: 'How do I prepare for campus placements?' };
    assert.equal(chatMessageSchema.safeParse(valid).success, true);

    const empty = { message: '' };
    assert.equal(chatMessageSchema.safeParse(empty).success, false);
  });
});

describe('Helper Utilities Tests', () => {
  test('truncate truncates text longer than maxLength with ellipsis', () => {
    const text = 'This is a long sentence explaining dynamic programming concepts.';
    const truncated = truncate(text, 20);
    assert.equal(truncated.length, 23); // 20 + '...'
    assert.ok(truncated.endsWith('...'));
  });

  test('truncate leaves shorter text intact', () => {
    const shortText = 'Hello';
    assert.equal(truncate(shortText, 20), 'Hello');
  });

  test('getTodayUTC returns valid YYYY-MM-DD string', () => {
    const today = getTodayUTC();
    assert.match(today, /^\d{4}-\d{2}-\d{2}$/);
  });
});
