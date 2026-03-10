import React from 'react';
import { Layout, Avatar, Dropdown, Space } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { AppButton } from '@/components/common/AppButton';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

const { Header } = Layout;

interface LayoutHeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  t: any;
  handleUserMenuClick: (event: { key: string }) => void;
  loggedUser: any;
}

export const LayoutHeader: React.FC<LayoutHeaderProps> = ({
  collapsed,
  setCollapsed,
  isDarkMode,
  toggleTheme,
  t,
  handleUserMenuClick,
  loggedUser,
}) => {
  return (
    <Header className="layout-header">
      <AppButton
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        className="header-toggle-btn"
      />
      <Space size="middle">
        {/* <LanguageSwitcher /> */}
        {/* <AppButton onClick={toggleTheme}>
          {isDarkMode ? t('lightMode') : t('darkMode')}
        </AppButton> */}
        <Dropdown
          menu={{
            items: [
              { key: 'profile', label: t('profile') },
              { key: 'logout', label: t('logout'), danger: true },
            ],
            onClick: handleUserMenuClick,
          }}
          placement="bottomRight"
        >
          <Space style={{ cursor: 'pointer' }}>
            <Avatar className="user-avatar" icon={<UserOutlined />} />
            <span style={{ fontWeight: 500 }}>{loggedUser?.fullname || loggedUser?.username || ''}</span>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};
