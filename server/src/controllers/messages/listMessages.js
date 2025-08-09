const Message = require('@src/models/Message');

module.exports = async function listMessages(req, res) {
  try {
    const limitParam = parseInt(req.query.limit, 10);
    let limit = Number.isNaN(limitParam) ? 50 : limitParam;
    if (limit <= 0) limit = 50;
    if (limit > 100) limit = 100;

    const beforeStr = req.query.before;
    let beforeDate = null;
    if (beforeStr) {
      const d = new Date(beforeStr);
      if (isNaN(d.getTime())) {
        return res.status(400).json({ error: 'Invalid "before" date format' });
      }
      beforeDate = d;
    }

    const filter = {};
    if (beforeDate) {
      filter.createdAt = { $lt: beforeDate };
    }

    const items = await Message.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    let hasMore = false;
    let nextBefore = null;

    if (items.length === limit) {
      const oldest = items[items.length - 1];
      const moreCount = await Message.countDocuments({ createdAt: { $lt: oldest.createdAt } });
      hasMore = moreCount > 0;
      nextBefore = oldest.createdAt && oldest.createdAt.toISOString
        ? oldest.createdAt.toISOString()
        : new Date(oldest.createdAt).toISOString();
    }

    return res.status(200).json({
      items,
      hasMore,
      nextBefore,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
