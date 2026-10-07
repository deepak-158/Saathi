const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      default: 'ACADEMICS',
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    importance: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
      default: 5,
    },
    sourceMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for frontend compatibility (frontend uses mem.text)
memorySchema.virtual('text').get(function () {
  return this.content;
});

memorySchema.index({ userId: 1, importance: -1 });
memorySchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Memory', memorySchema);
