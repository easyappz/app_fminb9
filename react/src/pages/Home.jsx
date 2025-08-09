import React, { useEffect, useState } from 'react';
import { Layout, Typography, theme } from 'antd';
import ChatRoom from '../components/ChatRoom';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

export default function Home() {
  const { token } = theme.useToken();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 576);
    handle();
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  return (
    <Layout style={{ minHeight: '100vh', background: token.colorBgLayout }}>
      <Header
        style={{
          background: `linear-gradient(90deg, ${token.colorPrimary} 0%, ${token.colorPrimaryBgHover} 100%)`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: 1120, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title level={4} style={{ color: token.colorWhite, margin: 0 }}>Чат</Title>
          <Text style={{ color: token.colorWhite, opacity: 0.9 }}>Онлайн-комната общения</Text>
        </div>
      </Header>

      <Content style={{ padding: isMobile ? 12 : 24, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex' }}>
          <div style={{ width: '100%', maxWidth: 960, margin: '0 auto' }}>
            <div style={{ height: '100%' }}>
              <ChatRoom />
            </div>
          </div>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', color: token.colorTextTertiary }}>
        Сделано с любовью · Easyappz
      </Footer>
    </Layout>
  );
}
