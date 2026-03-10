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
        },
        components: {
          Button: {
            borderRadius: 6,
            controlHeight: 36,
          },
          Input: {
            borderRadius: 6,
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
