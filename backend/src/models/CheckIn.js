const mongoose = require('mongoose');

const MOODS = ['good', 'okay', 'meh', 'neutral', 'low', 'stressed', 'frustrated'];
const REASONS = [
  'college', 'placement', 'studies', 'career',
  'relationships', 'family', 'money', 'loneliness', 'other',
];

const checkInSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    mood: {
      type: String,
      enum: MOODS,
      required: true,
    },
    reason: {
      type: String,
      enum: REASONS,
      default: 'other',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    note: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    aiNote: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

checkInSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('CheckIn', checkInSchema);
module.exports.MOODS = MOODS;
module.exports.REASONS = REASONS;
