const { Message, MESSAGE_LIMITS } = require('@src/models/Message');

module.exports = async (req, res) => {
  try {
    const { author, text } = req.body || {};

    if (typeof author !== 'string' || typeof text !== 'string') {
      return res.status(400).json({ error: 'author and text must be strings' });
    }

    const authorTrim = author.trim();
    const textTrim = text.trim();

    if (!authorTrim || !textTrim) {
      return res.status(400).json({ error: 'author and text cannot be empty' });
    }

    const { AUTHOR_MIN, AUTHOR_MAX, TEXT_MIN, TEXT_MAX } = MESSAGE_LIMITS;

    if (authorTrim.length < AUTHOR_MIN || authorTrim.length > AUTHOR_MAX) {
      return res.status(400).json({ error: `author length must be between ${AUTHOR_MIN} and ${AUTHOR_MAX}` });
    }

    if (textTrim.length < TEXT_MIN || textTrim.length > TEXT_MAX) {
      return res.status(400).json({ error: `text length must be between ${TEXT_MIN} and ${TEXT_MAX}` });
    }

    const saved = await Message.create({ author: authorTrim, text: textTrim });
    return res.status(201).json(saved);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
