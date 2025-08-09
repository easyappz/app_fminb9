import instance from './axios';

/**
 * Fetch chat messages
 * @param {Object} params
 * @param {number} [params.limit=50]
 * @param {string} [params.before]
 * @returns {Promise<{items: Array, hasMore?: boolean, nextBefore?: string|null}>}
 */
export async function getMessages({ limit = 50, before } = {}) {
  const params = {};
  if (typeof limit === 'number') params.limit = limit;
  if (before) params.before = before;
  const res = await instance.get('/api/chat/messages', { params });
  return res.data;
}

/**
 * Send a new chat message
 * @param {{author: string, text: string}} payload
 * @returns {Promise<Object>}
 */
export async function sendMessage(payload) {
  const res = await instance.post('/api/chat/messages', payload);
  return res.data;
}

export default {
  getMessages,
  sendMessage,
};
