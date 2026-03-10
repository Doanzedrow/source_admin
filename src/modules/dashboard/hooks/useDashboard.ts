import { useTranslation } from 'react-i18next';

export const useDashboard = () => {
  const { t } = useTranslation('dashboard');

  // Hardcoded data temporarily
  const data = {
    revenue: "50.000.000đ",
    orders: 120
  };

  return {
    t,
    data
  };
};
