import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { performLogout, selectLoggedUser } from '@/modules/auth/slice/authSlice';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import type { AppDispatch } from '@/store';

export const useMainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { t, i18n } = useTranslation();
  const { goToLogin, to } = useAppNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const loggedUser = useSelector(selectLoggedUser);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleLanguage = () => i18n.changeLanguage(i18n.language === 'en' ? 'vi' : 'en');

  const onMenuClick = (key: string) => {
    to(key);
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      dispatch(performLogout());
      goToLogin();
    }
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
    handleUserMenuClick,
    loggedUser,
  };
};
