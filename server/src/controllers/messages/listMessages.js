const { Message } = require('@src/models/Message');

module.exports = async (req, res) => {
  try {
    const limitRaw = req.query.limit;
    let limit = 50;

    if (typeof limitRaw !== 'undefined') {
      const parsed = parseInt(limitRaw, 10);
      if (!Number.isNaN(parsed) && parsed > 0) {
        limit = parsed;
      }
    }

    if (limit > 200) {
      limit = 200;
    }

    const filter = {};
    const { before } = req.query;

    if (typeof before !== 'undefined') {
      const date = new Date(before);
      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({ error: "Invalid 'before' parameter. Must be ISO date-time." });
      }
      filter.createdAt = { $lt: date };
    }

    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
