import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Space } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  ShopOutlined,
  TransactionOutlined
} from '@ant-design/icons';
import { useMainLayout } from './hooks/useMainLayout';
import { AppButton } from '@/components/common/AppButton';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { rc, RouteKey } from '@/routes/routeConfig';
import './MainLayout.less';

const { Header, Sider, Content } = Layout;

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    collapsed,
    setCollapsed,
    isDarkMode,
    toggleTheme,
    t,
    location,
    onMenuClick,
  } = useMainLayout();

  const menuItems = [
    { 
      key: rc(RouteKey.Dashboard).path, 
      icon: rc(RouteKey.Dashboard).icon, 
      label: t('dashboard') 
    },
    { 
      key: rc(RouteKey.Products).path, 
      icon: rc(RouteKey.Products).icon, 
      label: t('products') 
    },
    // Group Example
    {
      key: 'user-group',
      icon: <UserOutlined />,
      label: t('users'),
      children: [
        { key: '/users/customers', label: t('customers') },
        { key: '/users/employees', label: t('employees') },
      ],
    },
    { key: '/orders', icon: <TransactionOutlined />, label: t('orders') },
    { key: '/appointments', icon: <ShopOutlined />, label: t('appointments') },
    { 
      key: rc(RouteKey.Settings).path, 
      icon: rc(RouteKey.Settings).icon, 
      label: t('settings') 
    },
  ];

  return (
    <Layout className="app-container main-layout">
      <Sider trigger={null} collapsible collapsed={collapsed} theme={isDarkMode ? 'dark' : 'light'} width={250}>
        <div className="logo-container">
          <h2>{collapsed ? t('logoMini') : t('logoFull')}</h2>
        </div>
        <Menu
          theme={isDarkMode ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={(e) => onMenuClick(e.key)}
        />
      </Sider>
      <Layout>
        <Header className="layout-header">
          <AppButton
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="header-toggle-btn"
          />
          <Space size="middle">
            <LanguageSwitcher />
            <AppButton onClick={toggleTheme}>
              {isDarkMode ? t('lightMode') : t('darkMode')}
            </AppButton>
            <Dropdown menu={{
              items: [
                { key: 'profile', label: t('profile') },
                { key: 'logout', label: t('logout'), danger: true }
              ]
            }} placement="bottomRight">
              <Avatar className="user-avatar" icon={<UserOutlined />} />
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
