import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  SettingOutlined,
  GlobalOutlined,
  ShopOutlined,
  TransactionOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './MainLayout.less';

const { Header, Sider, Content } = Layout;

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleLanguage = () => i18n.changeLanguage(i18n.language === 'en' ? 'vi' : 'en');

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: t('dashboard') },
    { key: '/products', icon: <ShoppingOutlined />, label: t('products') },
    // Group Example
    {
      key: 'user-group',
      icon: <UserOutlined />,
      label: t('users'),
      children: [
        { key: '/users/customers', label: 'Khách hàng' },
        { key: '/users/employees', label: 'Nhân viên' },
      ],
    },
    { key: '/orders', icon: <TransactionOutlined />, label: 'Đơn hàng' },
    { key: '/appointments', icon: <ShopOutlined />, label: 'Lịch hẹn' },
    { key: '/system/settings', icon: <SettingOutlined />, label: t('settings') },
  ];

  return (
    <Layout className="app-container main-layout">
      <Sider trigger={null} collapsible collapsed={collapsed} theme={isDarkMode ? 'dark' : 'light'} width={250}>
        <div className="logo-container flex-center">
          <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>{collapsed ? 'A' : 'Zinisoft'}</h2>
        </div>
        <Menu
          theme={isDarkMode ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={(e) => navigate(e.key)}
        />
      </Sider>
      <Layout>
        <Header className="layout-header flex-between" style={{ padding: '0 24px', background: 'var(--body-bg)' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <Space size="middle">
            <Button onClick={toggleLanguage} icon={<GlobalOutlined />}>
              {i18n.language.toUpperCase()}
            </Button>
            <Button onClick={toggleTheme}>
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
            <Dropdown menu={{
              items: [
                { key: 'profile', label: 'Hồ sơ' },
                { key: 'logout', label: t('logout'), danger: true }
              ]
            }} placement="bottomRight">
              <Avatar style={{ backgroundColor: 'var(--primary-color)', cursor: 'pointer' }} icon={<UserOutlined />} />
            </Dropdown>
          </Space>
        </Header>
        <Content className="layout-content">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
