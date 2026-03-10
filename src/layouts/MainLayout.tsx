import React from 'react';
import { Layout } from 'antd';
import { useMainLayout } from './hooks/useMainLayout';
import { LayoutHeader } from './components/LayoutHeader';
import { LayoutSider } from './components/LayoutSider';
import { LayoutContent } from './components/LayoutContent';
import './MainLayout.less';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    collapsed,
    setCollapsed,
    isDarkMode,
    toggleTheme,
    t,
    location,
    onMenuClick,
    handleUserMenuClick,
    loggedUser,
  } = useMainLayout();

  return (
    <Layout className="app-container main-layout">
      <LayoutSider
        collapsed={collapsed}
        isDarkMode={isDarkMode}
        t={t}
        location={location}
        onMenuClick={onMenuClick}
      />
      <Layout>
        <LayoutHeader
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          t={t}
          handleUserMenuClick={handleUserMenuClick}
          loggedUser={loggedUser}
        />
        <LayoutContent>
          {children}
        </LayoutContent>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
