import React, { useEffect } from 'react';
import { Layout, Drawer } from 'antd';
import { useMainLayout } from './hooks/useMainLayout';
import { LayoutHeader } from './components/LayoutHeader';
import { LayoutSider } from './components/LayoutSider';
import { LayoutContent } from './components/LayoutContent';
import { useResponsive } from '@/hooks/useResponsive';
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

  const { isSmallScreen } = useResponsive();

  useEffect(() => {
    if (isSmallScreen) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [isSmallScreen, setCollapsed]);

  const handleMenuClickWrapper = (key: string) => {
    onMenuClick(key);
    if (isSmallScreen) {
      setCollapsed(true);
    }
  };

  return (
    <Layout className="app-container main-layout">
     
      {!isSmallScreen ? (
        <LayoutSider
          collapsed={collapsed}
          isDarkMode={isDarkMode}
          t={t}
          location={location}
          onMenuClick={handleMenuClickWrapper}
        />
      ) : (
        <Drawer
          placement="left"
          closable={false}
          onClose={() => setCollapsed(true)} 
          open={!collapsed}                  
          styles={{ body: { padding: 0 } }}  
          width={250}
        >
          <LayoutSider
            collapsed={false}
            isDarkMode={isDarkMode}
            t={t}
            location={location}
            onMenuClick={handleMenuClickWrapper}
          />
        </Drawer>
      )}

      <Layout style={{ 
        width: isSmallScreen ? '100%' : `calc(100% - ${collapsed ? 80 : 250}px)`,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
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
