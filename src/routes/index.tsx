import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import AuthLayout from '@/layouts/AuthLayout';
import { rc, RouteKey } from './routeConfig';

import Dashboard from '@/modules/dashboard/pages/Dashboard';
import ProductList from '@/modules/product/pages/ProductList';
import Login from '@/modules/auth/pages/Login';

const router = createBrowserRouter([
  {
    path: rc(RouteKey.Login).path,
    element: <AuthLayout />,
    children: [
      { path: '', element: <Login /> }
    ]
  },
  {
    path: '/',
    element: <PrivateRoute allowedRoles={['superadmin', 'admin']} />,
    children: [
      { path: '', element: <Navigate to={rc(RouteKey.Dashboard).path} replace /> },
      { path: rc(RouteKey.Dashboard).path.substring(1), element: <Dashboard /> },
      { path: rc(RouteKey.Products).path.substring(1), element: <ProductList /> },
    ]
  },
  {
    path: '/system',
    element: <PrivateRoute allowedRoles={['superadmin']} />,
    children: [
      { path: 'settings', element: <div className="page-content">Hệ thống Cài đặt chuyên môn superadmin</div> }
    ]
  },
  {
    path: rc(RouteKey.NotFound).path,
    element: <div>404 Not Found</div>
  }
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
