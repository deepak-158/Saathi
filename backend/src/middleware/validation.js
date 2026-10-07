const { z } = require('zod');

// Reusable validation middleware factory
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    const issues = error.issues || error.errors || [];
    const errors = issues.map((e) => ({
      field: Array.isArray(e.path) ? e.path.join('.') : String(e.path || ''),
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }
};

// Auth schemas
const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  college: z.string().optional(),
  degree: z.string().optional(),
  branch: z.string().optional(),
  year: z.union([z.number(), z.string()]).optional(),
});

const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

// Profile schema
const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(50).optional(),
  college: z.string().trim().max(200).optional(),
  degree: z.string().trim().max(100).optional(),
  branch: z.string().trim().max(100).optional(),
  year: z.union([z.number(), z.string()]).nullable().optional(),
  graduationYear: z.union([z.number().int().min(2020).max(2035), z.string(), z.null()]).optional(),
  cgpa: z.union([z.number().min(0).max(10), z.string(), z.null()]).optional(),
  careerGoal: z.string().trim().max(200).optional(),
  skills: z.array(z.string().trim().max(50)).max(20).optional(),
  interests: z.array(z.string().trim().max(50)).max(20).optional(),
  onboardingComplete: z.boolean().optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).optional(),
    notifications: z.boolean().optional(),
    tone: z.string().optional(),
    language: z.string().optional(),
  }).optional(),
});

// Chat schema
const chatMessageSchema = z.object({
  message: z.string().trim().min(1, 'Message cannot be empty').max(5000, 'Message is too long (max 5000 characters)'),
  conversationId: z.string().nullable().optional(),
  mode: z.string().optional(),
});

// Memory schema - flexible to accept 'content' or 'text'
const createMemorySchema = z.object({
  category: z.string().optional(),
  content: z.string().trim().max(1000).optional(),
  text: z.string().trim().max(1000).optional(),
  importance: z.number().int().min(1).max(10).optional(),
});

const updateMemorySchema = z.object({
  content: z.string().trim().max(1000).optional(),
  text: z.string().trim().max(1000).optional(),
  category: z.string().optional(),
  importance: z.number().int().min(1).max(10).optional(),
});

// Goal schema
const createGoalSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(1000).optional(),
  category: z.string().optional(),
  targetDate: z.string().nullable().optional(),
  tasks: z.array(z.object({
    title: z.string().trim().min(1).max(300),
    completed: z.boolean().optional(),
    isCompleted: z.boolean().optional(),
  })).max(50).optional(),
});

const updateGoalSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(1000).optional(),
  category: z.string().optional(),
  targetDate: z.string().nullable().optional(),
  status: z.string().optional(),
  tasks: z.array(z.object({
    _id: z.string().optional(),
    title: z.string().trim().min(1).max(300),
    completed: z.boolean().optional(),
    isCompleted: z.boolean().optional(),
  })).max(50).optional(),
});

// Check-in schema
const checkInSchema = z.object({
  mood: z.string().trim().min(1),
  reason: z.string().optional(),
  tags: z.array(z.string()).optional(),
  note: z.string().trim().max(500).optional(),
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  chatMessageSchema,
  createMemorySchema,
  updateMemorySchema,
  createGoalSchema,
  updateGoalSchema,
  checkInSchema,
};
