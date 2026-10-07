const mongoose = require('mongoose');

const MODES = ['talk', 'placement', 'study', 'tutor', 'career', 'motivation', 'planning', 'strict'];

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'New Conversation',
      trim: true,
      maxlength: 200,
    },
    summary: {
      type: String,
      default: '',
      maxlength: 5000,
    },
    mode: {
      type: String,
      enum: MODES,
      default: 'talk',
    },
    messageCount: {
      type: Number,
      default: 0,
    },
    lastSummarizedAt: {
      type: Number,
      default: 0,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ userId: 1, lastMessageAt: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);
module.exports.MODES = MODES;
