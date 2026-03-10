import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import type { Role } from '../types';
import MainLayout from '../layouts/MainLayout';

interface PrivateRouteProps {
  allowedRoles: Role[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  // Lấy Token từ kho chung
  const token = localStorage.getItem('accessToken');
  
  // Fake Role cho User tạm thời để demo (Sau này lấy từ Redux hoặc jwt-decode)
  const user = { role: 'superadmin' as Role };

  // KHÔNG CÓ TOKEN THÌ ĐÁ VĂNG RA LOGIN
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // CÓ TOKEN NHƯNG KHÔNG ĐỦ QUYỀN
  if (user && !allowedRoles.includes(user.role)) {
    return <div className="flex-center" style={{ height: '100vh' }}><h3>403 Forbidden - Bạn không có quyền truy cập module này!</h3></div>;
  }

  // CHO PHÉP VÀO
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
