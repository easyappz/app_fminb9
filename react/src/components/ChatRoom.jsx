import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card, List, Avatar, Input, Button, Modal, Typography, Alert, Spin, message, Empty, Space } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMessages, sendMessage } from '../api/chat';

const { Text, Title } = Typography;
const { TextArea } = Input;

function getAvatarLetter(name) {
  if (!name || typeof name !== 'string') return '?';
  const trimmed = name.trim();
  if (!trimmed) return '?';
  return trimmed.charAt(0).toUpperCase();
}

function formatTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export default function ChatRoom() {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const listRef = useRef(null);
  const [stickToBottom, setStickToBottom] = useState(true);

  const [authorName, setAuthorName] = useState('');
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('chatAuthor');
    if (stored && stored.trim()) {
      setAuthorName(stored);
      setIsNameModalOpen(false);
    } else {
      setIsNameModalOpen(true);
    }
  }, []);

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ['chatMessages'],
    queryFn: () => getMessages({ limit: 50 }),
    refetchInterval: 2000,
    staleTime: 1000,
    retry: 2,
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  });

  const itemsDesc = data?.items || [];
  const itemsAsc = useMemo(() => {
    const arr = [...itemsDesc];
    arr.reverse();
    return arr;
  }, [itemsDesc]);

  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      setText('');
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
    },
    onError: (err) => {
      const msg = err?.response?.data?.error || err?.message || 'Ошибка отправки сообщения';
      messageApi.error(msg);
    },
  });

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  const handleScroll = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const threshold = 48;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setStickToBottom(distanceFromBottom < threshold);
  }, []);

  useEffect(() => {
    if (stickToBottom) {
      // Allow list to render before scrolling
      const id = setTimeout(scrollToBottom, 0);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [itemsAsc, stickToBottom, scrollToBottom]);

  const handleSend = async () => {
    const name = (authorName || '').trim();
    const content = (text || '').trim();

    if (!name) {
      setIsNameModalOpen(true);
      messageApi.warning('Пожалуйста, укажите имя');
      return;
    }

    if (!content) {
      messageApi.warning('Введите текст сообщения');
      return;
    }

    if (content.length > 2000) {
      messageApi.warning('Сообщение слишком длинное (максимум 2000 символов)');
      return;
    }

    await mutation.mutateAsync({ author: name, text: content });
  };

  const handleSaveName = () => {
    const val = nameInput.trim();
    if (!val) {
      messageApi.warning('Введите имя');
      return;
    }
    if (val.length > 80) {
      messageApi.warning('Имя слишком длинное (максимум 80 символов)');
      return;
    }
    setAuthorName(val);
    localStorage.setItem('chatAuthor', val);
    setIsNameModalOpen(false);
  };

  const onPressEnterWithModifier = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: 16 }}>
      {contextHolder}

      <Card
        title={<Title level={4} style={{ margin: 0 }}>Чат</Title>}
        extra={<Text type="secondary">Обновление каждые 2 сек</Text>}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '70vh' }}>
          <div
            ref={listRef}
            onScroll={handleScroll}
            style={{ flex: 1, overflowY: 'auto', padding: 16, background: '#fafafa' }}
          >
            {isError && (
              <div style={{ marginBottom: 12 }}>
                <Alert type="error" message="Ошибка загрузки" description={error?.message || 'Не удалось загрузить сообщения'} showIcon />
              </div>
            )}

            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
                <Spin tip="Загрузка сообщений..." />
              </div>
            ) : itemsAsc.length === 0 ? (
              <Empty description="Пока нет сообщений" />
            ) : (
              <List
                dataSource={itemsAsc}
                renderItem={(item) => (
                  <List.Item key={item._id} style={{ padding: '8px 0' }}>
                    <List.Item.Meta
                      avatar={<Avatar>{getAvatarLetter(item.author)}</Avatar>}
                      title={
                        <Space size={8} wrap>
                          <Text strong>{item.author}</Text>
                          <Text type="secondary">{formatTime(item.createdAt)}</Text>
                        </Space>
                      }
                      description={<Text style={{ whiteSpace: 'pre-wrap' }}>{item.text}</Text>}
                    />
                  </List.Item>
                )}
              />
            )}
            {isFetching && !isLoading && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 8 }}>
                <Text type="secondary">Обновление...</Text>
              </div>
            )}
          </div>

          <div style={{ borderTop: '1px solid #f0f0f0', padding: 12, background: '#fff' }}>
            <Space direction="vertical" style={{ width: '100%' }} size={8}>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button onClick={() => setIsNameModalOpen(true)}>Изменить имя</Button>
                <Text type="secondary">Текущее имя: {authorName ? authorName : 'не задано'}</Text>
              </div>
              <TextArea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={onPressEnterWithModifier}
                placeholder="Введите сообщение... (Ctrl/⌘ + Enter — отправить)"
                maxLength={2000}
                showCount
                autoSize={{ minRows: 2, maxRows: 6 }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" onClick={handleSend} loading={mutation.isPending} disabled={!text.trim()}>
                  Отправить
                </Button>
              </div>
            </Space>
          </div>
        </div>
      </Card>

      <Modal
        title="Ваше имя"
        open={isNameModalOpen}
        onOk={handleSaveName}
        onCancel={() => setIsNameModalOpen(false)}
        okText="Сохранить"
        cancelText="Отмена"
        destroyOnClose
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>Пожалуйста, укажите имя, которое будет отображаться в чате.</Text>
          <Input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Например, Алексей"
            maxLength={80}
            onPressEnter={handleSaveName}
            autoFocus
          />
        </Space>
      </Modal>
    </div>
  );
}
