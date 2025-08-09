const express = require('express');
const listMessages = require('@src/controllers/messages/listMessages');
const createMessage = require('@src/controllers/messages/createMessage');

const router = express.Router();

// GET /api/hello
router.get('/hello', async (req, res) => {
  try {
    res.json({ message: 'Hello from API!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/status
router.get('/status', async (req, res) => {
  try {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Messages endpoints
router.get('/messages', listMessages);
router.post('/messages', createMessage);

module.exports = router;
