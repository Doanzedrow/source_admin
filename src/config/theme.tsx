import { ConfigProvider, theme, App } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import viVN from 'antd/locale/vi_VN';
import enUS from 'antd/locale/en_US';
import { APP_COLOR_PRIMARY } from './constants';

export const ThemeProvider: React.FC<{ children: React.ReactNode; isDarkMode: boolean }> = ({
  children,
  isDarkMode,
}) => {
  const { i18n } = useTranslation();

  const antdLocale = i18n.language.startsWith('vi') ? viVN : enUS;

  return (
    <ConfigProvider
      locale={antdLocale}
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: APP_COLOR_PRIMARY,
          borderRadius: 6,
          fontFamily: "'Montserrat', sans-serif",
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
            borderRadiusLG: 8,
            headerHeight: 48,
            colorBorderSecondary: isDarkMode ? '#303030' : '#f0f0f0',
            // Increase shadow and padding to look more like 'Big Tech' UI
            paddingLG: 24,
            headerBg: 'transparent',
            boxShadowTertiary:
              '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
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
      <App>{children}</App>
    </ConfigProvider>
  );
};
