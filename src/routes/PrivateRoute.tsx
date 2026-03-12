import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useValidateTokenQuery } from '@/modules/auth/api/authApi';
import { tokenUtil } from '@/utils/token';
import MainLayout from '@/layouts/MainLayout';
import { ErrorPage } from '@/components/common/ErrorPage';
import { AppLoader } from '@/components/common/AppLoader/AppLoader';
import { usePermission } from '@/hooks/usePermission';

interface PrivateRouteProps {
  allowedRoles: string[];
  requiredPermission?: {
    module: string;
    action?: 'view' | 'create' | 'update' | 'delete';
  };
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles, requiredPermission }) => {
  const token = tokenUtil.getToken();
  const { user, can, isSuperAdmin } = usePermission();

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

  // 1. Check Module Permission first if defined
  if (requiredPermission) {
    const { module, action = 'view' } = requiredPermission;
    if (!can(module, action)) {
      return <ErrorPage status="403" />;
    }
  }

  // 2. Fallback to Role-based check (for broad access)
  const userRoles: string[] = [];
  if (isSuperAdmin) userRoles.push('superadmin');
  if (user?.isAdmin || user?.role?.name?.toLowerCase() === 'admin') userRoles.push('admin');

  const hasRoleAccess = allowedRoles.length === 0 || allowedRoles.some((role) => userRoles.includes(role));

  if (!hasRoleAccess) {
    return <ErrorPage status="403" />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
