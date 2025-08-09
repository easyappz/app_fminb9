const mongoose = require('mongoose');

const AUTHOR_MIN = 1;
const AUTHOR_MAX = 100;
const TEXT_MIN = 1;
const TEXT_MAX = 1000;

const MessageSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
      trim: true,
      minlength: AUTHOR_MIN,
      maxlength: AUTHOR_MAX,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: TEXT_MIN,
      maxlength: TEXT_MAX,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', MessageSchema);

module.exports = {
  Message,
  MESSAGE_LIMITS: {
    AUTHOR_MIN,
    AUTHOR_MAX,
    TEXT_MIN,
    TEXT_MAX,
  },
};
