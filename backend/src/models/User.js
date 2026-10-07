const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name must be at most 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    // Student profile fields
    college: { type: String, trim: true, default: '' },
    degree: { type: String, trim: true, default: 'B.Tech' },
    branch: { type: String, trim: true, default: '' },
    year: { type: mongoose.Schema.Types.Mixed, default: '' },
    graduationYear: { type: Number, default: null },
    cgpa: { type: Number, min: 0, max: 10, default: null },
    careerGoal: { type: String, trim: true, default: '' },
    skills: [{ type: String, trim: true }],
    interests: [{ type: String, trim: true }],
    preferences: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
      notifications: { type: Boolean, default: true },
      tone: { type: String, default: 'friendly' },
    },
    onboardingComplete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return;
  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Never return passwordHash in JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
