import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const useMainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleLanguage = () => i18n.changeLanguage(i18n.language === 'en' ? 'vi' : 'en');

  const onMenuClick = (key: string) => {
    navigate(key);
  };

  return {
    collapsed,
    setCollapsed,
    isDarkMode,
    toggleTheme,
    toggleLanguage,
    t,
    i18n,
    location,
    onMenuClick,
  };
};
