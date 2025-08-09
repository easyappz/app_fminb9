import instance from './axios';

export async function getMessages(params = {}) {
  const query = {};
  if (typeof params.limit === 'number') {
    query.limit = params.limit;
  }
  if (params.before) {
    query.before = params.before;
  }
  const { data } = await instance.get('/api/chat/messages', { params: query });
  return data;
}

export async function sendMessage(payload) {
  const { data } = await instance.post('/api/chat/messages', payload);
  return data;
}
