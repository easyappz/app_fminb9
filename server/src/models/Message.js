const mongoose = require('mongoose');

const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    author: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    versionKey: false,
  }
);

// Descending index on createdAt for efficient sorting by newest first
MessageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Message', MessageSchema);
