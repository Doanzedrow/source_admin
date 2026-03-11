import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { selectLoggedUser } from '@/modules/auth/slice/authSlice';
import { useValidateTokenQuery } from '@/modules/auth/api/authApi';
import { tokenUtil } from '@/utils/token';
import MainLayout from '@/layouts/MainLayout';
import { ErrorPage } from '@/components/common/ErrorPage';
import { AppLoader } from '@/components/common/AppLoader/AppLoader';
import type { Role } from '@/types';

interface PrivateRouteProps {
  allowedRoles: Role[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const token = tokenUtil.getToken();
  const user = useAppSelector(selectLoggedUser);

  const { isLoading, isError } = useValidateTokenQuery(undefined, {
    skip: !token || !!user,
    refetchOnMountOrArgChange: 30,
  });

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user && isLoading) {
    return <AppLoader />;
  }

  if (!user && (isError || !isLoading)) {
    tokenUtil.removeToken();
    tokenUtil.removeLoggedUser();
    return <Navigate to="/login" replace />;
  }

  const userRoles: Role[] = [];
  if (user.isSuperAdmin) userRoles.push('superadmin');
  if (user.isAdmin || user.role?.name?.toLowerCase() === 'admin') userRoles.push('admin');
  if (typeof user.role === 'string') userRoles.push(user.role as Role);

  const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

  if (!hasAccess) {
    return <ErrorPage status="403" />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
