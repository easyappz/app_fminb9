import instance from './axios';

/**
 * Fetch chat messages with optional pagination.
 * Implements the API exactly as described in server/src/api_schema.yaml
 * GET /api/chat/messages?limit&before
 *
 * @param {Object} [params]
 * @param {number} [params.limit] - 1..100
 * @param {string} [params.before] - ISO8601 date-time string
 * @returns {Promise<{ items: Array, hasMore: boolean, nextBefore: string | null }>}
 */
export async function getMessages({ limit, before } = {}) {
  const params = {};

  if (typeof limit === 'number') {
    params.limit = limit;
  }
  if (before) {
    params.before = before;
  }

  const response = await instance.get('/api/chat/messages', { params });
  return response.data;
}

/**
 * Create a new chat message.
 * Implements the API exactly as described in server/src/api_schema.yaml
 * POST /api/chat/messages
 *
 * @param {Object} payload
 * @param {string} payload.author
 * @param {string} payload.text
 * @returns {Promise<{ _id: string, author: string, text: string, createdAt: string, updatedAt: string }>}
 */
export async function sendMessage({ author, text }) {
  const response = await instance.post('/api/chat/messages', { author, text });
  return response.data;
}

export default {
  getMessages,
  sendMessage,
};
