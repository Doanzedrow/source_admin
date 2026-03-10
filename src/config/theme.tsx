import { ConfigProvider, theme, App } from 'antd';
import React from 'react';
import { APP_COLOR_PRIMARY } from './constants';

export const ThemeProvider: React.FC<{ children: React.ReactNode; isDarkMode: boolean }> = ({ children, isDarkMode }) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: APP_COLOR_PRIMARY,
          borderRadius: 6,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          fontSizeHeading1: 32,
          fontSizeHeading2: 24,
          fontSizeHeading3: 20,
          fontSizeHeading4: 16,
          fontSizeHeading5: 14,
          controlHeight: 38,
          controlHeightSM: 32,
          controlHeightLG: 46,
          lineHeight: 1.5715,
          colorTextBase: isDarkMode ? '#ffffff' : '#1f1f1f',
          colorBgBase: isDarkMode ? '#141414' : '#ffffff',
        },
        components: {
          Button: {
            borderRadius: 6,
            fontWeight: 500,
          },
          Input: {
            borderRadius: 6,
          },
          Select: {
            borderRadius: 6,
          },
          Card: {
            borderRadiusLG: 8, // lg border radius defined in variables
            headerHeight: 48,
            colorBorderSecondary: isDarkMode ? '#303030' : '#f0f0f0',
          },
          Table: {
            borderRadius: 8,
            headerBorderRadius: 8,
            headerBg: isDarkMode ? '#1f1f1f' : '#f0f2f5',
          },
          Modal: {
            borderRadiusLG: 12,
          },
          Menu: {
            itemBorderRadius: 4,
          },
          Form: {
            itemMarginBottom: 16,
          },
        },
      }}
    >
      <App>
        {children}
      </App>
    </ConfigProvider>
  );
};
