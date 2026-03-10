import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { selectLoggedUser } from '@/modules/auth/slice/authSlice';
import { tokenUtil } from '@/utils/token';
import MainLayout from '@/layouts/MainLayout';
import type { Role } from '@/types';

interface PrivateRouteProps {
  allowedRoles: Role[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { t } = useTranslation();
  const token = tokenUtil.getToken();
  const user = useAppSelector(selectLoggedUser);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check role if user info is available
  let hasAccess = false;
  
  if (user) {
    const userRoles: Role[] = [];
    if (user.isSuperAdmin) userRoles.push('superadmin');
    if (user.isAdmin || user.role?.name?.toLowerCase() === 'admin') userRoles.push('admin');
    
    // Default fallback if role is a string (just in case of type changes)
    if (typeof user.role === 'string') userRoles.push(user.role as Role);

    hasAccess = allowedRoles.some(role => userRoles.includes(role));
  }

  if (user && !hasAccess) {
    return (
      <div className="app-forbidden-container" style={{ padding: '24px', textAlign: 'center' }}>
        <h3>{t('forbidden')}</h3>
      </div>
    );
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
