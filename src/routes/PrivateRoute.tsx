import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import type { Role } from '@/types';
import MainLayout from '@/layouts/MainLayout';

import { useTranslation } from 'react-i18next';

interface PrivateRouteProps {
  allowedRoles: Role[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { t } = useTranslation();
  const token = localStorage.getItem('accessToken');

  const user = { role: 'superadmin' as Role };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <div className="app-suspense-fallback"><h3>{t('forbidden')}</h3></div>;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
