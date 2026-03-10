import React from 'react';
import { Dropdown } from 'antd';
import { useTranslation } from 'react-i18next';
import { AppButton } from '../AppButton';
import CachedImage from '../CachedImage/CachedImage';
import { SUPPORTED_LANGUAGES } from '@/config/constants';
import './LanguageSwitcher.less';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleMenuClick = (e: { key: string }) => {
    i18n.changeLanguage(e.key);
  };

  const renderFlag = (flag: string) => {
    if (flag.startsWith('<')) {
      return <span className="flag-html-container" dangerouslySetInnerHTML={{ __html: flag }} />;
    }

    if (flag.includes('/') || flag.includes('.')) {
      return (
        <span className="flag-image-container">
          <CachedImage src={flag} alt="flag" width={20} height={14} />
        </span>
      );
    }
    return <span className="flag-emoji">{flag}</span>;
  };

  const items = SUPPORTED_LANGUAGES.map((lang) => ({
    key: lang.code,
    label: (
      <div className="language-switcher-item">
        {renderFlag(lang.flag)}
        <span>{lang.label}</span>
      </div>
    ),
  }));

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  return (
    <Dropdown menu={{ items, onClick: handleMenuClick }} placement="bottomRight" trigger={['click']}>
      <AppButton type="text">
        <div className="language-switcher-trigger">
          {renderFlag(currentLang.flag)}
          <span>{currentLang.label}</span>
        </div>
      </AppButton>
    </Dropdown>
  );
};
