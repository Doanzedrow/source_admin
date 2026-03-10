import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { selectLoggedUser } from '@/modules/auth/slice/authSlice';
import { tokenUtil } from '@/utils/token';
import MainLayout from '@/layouts/MainLayout';
import { ErrorPage } from '@/components/common/ErrorPage';
import type { Role } from '@/types';

interface PrivateRouteProps {
  allowedRoles: Role[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const token = tokenUtil.getToken();
  const user = useAppSelector(selectLoggedUser);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let hasAccess = false;

  if (user) {
    const userRoles: Role[] = [];
    if (user.isSuperAdmin) userRoles.push('superadmin');
    if (user.isAdmin || user.role?.name?.toLowerCase() === 'admin') userRoles.push('admin');

    if (typeof user.role === 'string') userRoles.push(user.role as Role);

    hasAccess = allowedRoles.some(role => userRoles.includes(role));
  }

  if (user && !hasAccess) {
    return <ErrorPage status="403" />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
