import React, { useEffect, useState } from 'react';
import instance from '../api/axios';

function Home() {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [nextBefore, setNextBefore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPage = async (before = null) => {
    try {
      setLoading(true);
      setError(null);
      const params = { limit: 20 };
      if (before) params.before = before;
      const res = await instance.get('/api/chat/messages', { params });
      const { items: pageItems, hasMore: pageHasMore, nextBefore: pageNextBefore } = res.data || {};
      if (before) {
        setItems((prev) => [...prev, ...(pageItems || [])]);
      } else {
        setItems(pageItems || []);
      }
      setHasMore(Boolean(pageHasMore));
      setNextBefore(pageNextBefore || null);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLoadMore = () => {
    if (hasMore && nextBefore) {
      fetchPage(nextBefore);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;
    try {
      setSubmitting(true);
      setError(null);
      const res = await instance.post('/api/chat/messages', {
        author: author.trim(),
        text: text.trim(),
      });
      const created = res.data;
      setItems((prev) => [created, ...prev]);
      setText('');
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Failed to create message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '24px auto', padding: '0 16px' }}>
      <h1>Chat</h1>

      <form onSubmit={onSubmit} style={{ marginBottom: 16, display: 'grid', gap: 8 }}>
        <input
          type="text"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={80}
          style={{ padding: 8 }}
          required
        />
        <textarea
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={2000}
          rows={4}
          style={{ padding: 8 }}
          required
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send'}
          </button>
          <button type="button" onClick={() => fetchPage()} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </form>

      {error && (
        <div style={{ color: 'red', marginBottom: 12 }}>Error: {error}</div>
      )}

      <div style={{ display: 'grid', gap: 12 }}>
        {items.map((m) => (
          <div key={m._id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
            <div style={{ fontWeight: 600 }}>{m.author}</div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>
              {m.createdAt ? new Date(m.createdAt).toLocaleString() : ''}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        {hasMore ? (
          <button onClick={onLoadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load more'}
          </button>
        ) : (
          <div style={{ color: '#666' }}>No more messages</div>
        )}
      </div>
    </div>
  );
}

export default Home;
