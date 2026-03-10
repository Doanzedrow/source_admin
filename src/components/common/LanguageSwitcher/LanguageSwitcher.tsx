import React from 'react';
import { Dropdown } from 'antd';
import { useTranslation } from 'react-i18next';
import { AppButton } from '../AppButton';
import CachedImage from '../CachedImage/CachedImage';
import { SUPPORTED_LANGUAGES } from '@/config/constants';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleMenuClick = (e: { key: string }) => {
    i18n.changeLanguage(e.key);
  };

  const renderFlag = (flag: string) => {
    if (flag.includes('/') || flag.includes('.')) {
      return (
        <span style={{ display: 'flex', alignItems: 'center', width: '20px', height: '14px', borderRadius: '2px', overflow: 'hidden' }}>
          <CachedImage src={flag} alt="flag" width={20} height={14} />
        </span>
      );
    }
    return <span style={{ fontSize: '1.2em', lineHeight: 1 }}>{flag}</span>;
  };

  const items = SUPPORTED_LANGUAGES.map((lang) => ({
    key: lang.code,
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {renderFlag(lang.flag)}
        <span>{lang.label}</span>
      </div>
    ),
  }));

  // Lấy ngôn ngữ hiện tại hoặc mặc định là phần tử đầu tiên
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  return (
    <Dropdown menu={{ items, onClick: handleMenuClick }} placement="bottomRight" trigger={['click']}>
      <AppButton type="text">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {renderFlag(currentLang.flag)}
          <span>{currentLang.label}</span>
        </div>
      </AppButton>
    </Dropdown>
  );
};
