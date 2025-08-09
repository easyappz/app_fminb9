import React, { useState } from 'react';
import { Layout, Typography, Card, List, Form, Input, Button } from 'antd';

const { Header, Content, Footer } = Layout;

function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, author: 'Система', text: 'Добро пожаловать в общий чат!' },
  ]);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const text = (values.message || '').trim();
    if (!text) return;

    const newMessage = {
      id: Date.now(),
      author: 'Вы',
      text,
    };

    setMessages((prev) => [...prev, newMessage]);
    form.resetFields();
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f6f8' }}>
      <Header style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Общий чат</Typography.Title>
      </Header>

      <Content style={{ padding: 16, display: 'flex', justifyContent: 'center' }}>
        <Card style={{ width: '100%', maxWidth: 920 }} bodyStyle={{ padding: 16 }}>
          <div
            style={{
              height: 420,
              overflowY: 'auto',
              paddingRight: 8,
              marginBottom: 16,
              border: '1px solid #f0f0f0',
              borderRadius: 8,
              background: '#fff',
            }}
          >
            <List
              dataSource={messages}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  <List.Item.Meta
                    title={<span style={{ fontWeight: 600 }}>{item.author}</span>}
                    description={item.text}
                  />
                </List.Item>
              )}
            />
          </div>

          <Form form={form} layout="inline" onFinish={onFinish} style={{ display: 'flex', gap: 8 }}>
            <Form.Item name="message" style={{ flex: 1, marginBottom: 0 }}>
              <Input placeholder="Введите сообщение..." allowClear />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit">Отправить</Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>

      <Footer style={{ textAlign: 'center', background: 'transparent' }}>
        Создано с помощью Easyappz
      </Footer>
    </Layout>
  );
}

export default ChatPage;
