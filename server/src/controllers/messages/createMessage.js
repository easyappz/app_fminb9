const Message = require('@src/models/Message');

module.exports = async function createMessage(req, res) {
  try {
    const { author, text } = req.body || {};

    if (!author || typeof author !== 'string' || !author.trim()) {
      return res.status(400).json({ error: 'author is required and must be a non-empty string' });
    }
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'text is required and must be a non-empty string' });
    }
    if (author.trim().length > 80) {
      return res.status(400).json({ error: 'author must be at most 80 characters' });
    }
    if (text.trim().length > 2000) {
      return res.status(400).json({ error: 'text must be at most 2000 characters' });
    }

    const doc = await Message.create({
      author: author.trim(),
      text: text.trim(),
    });

    return res.status(201).json(doc);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
