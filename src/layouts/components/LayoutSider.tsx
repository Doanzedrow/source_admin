import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, ShopOutlined, TransactionOutlined, SafetyCertificateOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons';
import { rc, RouteKey, routesArray } from '@/routes/routeConfig';
import { usePermission } from '@/hooks/usePermission';
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
  const { can } = usePermission();

  const filterMenuItems = (items: any[]) => {
    return items
      .map((item) => {
        if (item.children) {
          const children = filterMenuItems(item.children);
          return children.length > 0 ? { ...item, children } : null;
        }

        const route = routesArray.find((r) => r.path === item.key);
        if (route?.requiredPermission) {
          return can(route.requiredPermission.module, route.requiredPermission.action || 'view')
            ? item
            : null;
        }

        return item;
      })
      .filter(Boolean);
  };

  const rawMenuItems = [
    { 
      key: rc(RouteKey.Dashboard).path, 
      icon: rc(RouteKey.Dashboard).icon, 
      label: t('dashboard') 
    },
    {
      key: 'catalog-group',
      icon: <ShopOutlined />,
      label: t('catalog'),
      children: [
        { 
          key: rc(RouteKey.Products).path, 
          icon: rc(RouteKey.Products).icon, 
          label: t('products') 
        },
        { 
          key: rc(RouteKey.Service).path, 
          icon: rc(RouteKey.Service).icon, 
          label: t('services') 
        },
        { 
          key: rc(RouteKey.Category).path, 
          icon: rc(RouteKey.Category).icon, 
          label: t('categories') 
        },
        { 
          key: rc(RouteKey.Attributes).path, 
          icon: rc(RouteKey.Attributes).icon, 
          label: t('attributes') 
        },
      ],
    },
    {
      key: 'user-group',
      icon: <UserOutlined />,
      label: t('users'),
      children: [
        { key: '/users/customers', label: t('customers') },
        { key: rc(RouteKey.Users).path, icon: rc(RouteKey.Users).icon, label: t('employees') },
      ],
    },
    { key: '/orders', icon: <TransactionOutlined />, label: t('orders') },
    { key: '/appointments', icon: <ShopOutlined />, label: t('appointments') },
    {
      key: 'system-group',
      icon: <SettingOutlined />,
      label: t('system'),
      children: [
        { 
          key: rc(RouteKey.Permission).path, 
          icon: <SafetyCertificateOutlined />, 
          label: t('permissions') 
        },
        { 
          key: rc(RouteKey.Role).path, 
          icon: <TeamOutlined />, 
          label: t('roles') 
        },
        { 
          key: rc(RouteKey.Settings).path, 
          icon: rc(RouteKey.Settings).icon, 
          label: t('settings') 
        },
      ],
    },
  ];

  const menuItems = filterMenuItems(rawMenuItems);

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      theme={isDarkMode ? 'dark' : 'light'}
      width={250}
      style={{ 
        height: '100vh', 
        borderRight: '1px solid var(--border-color)',
        overflow: 'auto',
        position: 'sticky',
        top: 0,
        left: 0
      }}
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
