import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import type { Role } from '@/types';
import MainLayout from '@/layouts/MainLayout';

interface PrivateRouteProps {
  allowedRoles: Role[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {

  const token = localStorage.getItem('accessToken');


  const user = { role: 'superadmin' as Role };


  if (!token) {
    return <Navigate to="/login" replace />;
  }


  if (user && !allowedRoles.includes(user.role)) {
    return <div className="flex-center" style={{ height: '100vh' }}><h3>403 Forbidden - Bạn không có quyền truy cập module này!</h3></div>;
  }


  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
