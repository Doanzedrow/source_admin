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

  // Gọi validateToken khi có token nhưng chưa có user info
  const { isLoading, isError } = useValidateTokenQuery(undefined, {
    skip: !token || !!user,
  });

  // 1. Không có token → về login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Đang validate token → hiển thị loading
  if (!user && isLoading) {
    return <AppLoader />;
  }

  // 3. Validate thất bại (token hết hạn/không hợp lệ) → về login
  if (!user && isError) {
    tokenUtil.removeToken();
    tokenUtil.removeLoggedUser();
    return <Navigate to="/login" replace />;
  }

  // 4. Không có user sau khi validate xong → về login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 5. Kiểm tra quyền truy cập
  const userRoles: Role[] = [];
  if (user.isSuperAdmin) userRoles.push('superadmin');
  if (user.isAdmin || user.role?.name?.toLowerCase() === 'admin') userRoles.push('admin');
  if (typeof user.role === 'string') userRoles.push(user.role as Role);

  const hasAccess = allowedRoles.some(role => userRoles.includes(role));

  if (!hasAccess) {
    return <ErrorPage status="403" />;
  }

  // 6. Mọi thứ OK → render page
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
