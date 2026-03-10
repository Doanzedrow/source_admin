import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, ShopOutlined, TransactionOutlined } from '@ant-design/icons';
import { rc, RouteKey } from '@/routes/routeConfig';

import { APP_ASSETS } from '@/config/assets';
import CachedImage from '@/components/common/CachedImage/CachedImage';

const { Sider } = Layout;

interface LayoutSiderProps {
  collapsed: boolean;
  isDarkMode: boolean;
  t: any;
  location: any;
  onMenuClick: (key: string) => void;
}

export const LayoutSider: React.FC<LayoutSiderProps> = ({
  collapsed,
  isDarkMode,
  t,
  location,
  onMenuClick,
}) => {
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
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      theme={isDarkMode ? 'dark' : 'light'}
      width={250}
    >
      <div className="logo-container">
        <CachedImage
          src={collapsed ? APP_ASSETS.LOGO_MINI_PRIMARY : APP_ASSETS.LOGO_PRIMARY}
          alt="App Logo"
          width="auto"
          height={collapsed ? 32 : 48}
          className="sider-logo"
        />
      </div>
      <Menu
        theme={isDarkMode ? 'dark' : 'light'}
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={(e) => onMenuClick(e.key)}
      />
    </Sider>
  );
};
