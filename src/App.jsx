import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import Recorder from './components/Recorder';
import LiveStreamPlayer from './components/LiveStreamPlayer';
import Livestream from './components/Livestream';
import './App.css';

const { Header, Content } = Layout;

const App = () => {
  const [streamUrl, setStreamUrl] = useState('https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8');

  // Các mục menu
  const menuItems = [
    { label: 'Home', key: '1' },
    { label: 'Recorder', key: '2' },
    { label: 'Player', key: '3' },
    { label: 'Livestream', key: '4' },
  ];

  return (
    <Layout className="layout">
      <Header>
        <div className="logo">Livestream App</div>
        {/* Menu điều hướng */}
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} items={menuItems} />
      </Header>
      <Content style={{ padding: '50px' }}>
        <div className="site-layout-content">
          <Livestream />
          {/* <Recorder /> */}
          {/* <LiveStreamPlayer streamUrl={streamUrl} /> */}
        </div>
      </Content>
    </Layout>
  );
}

export default App;
