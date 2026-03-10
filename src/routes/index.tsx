import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import AuthLayout from '../layouts/AuthLayout';

// Mock Pages for Structure
import Dashboard from '../modules/dashboard/pages/Dashboard';
import ProductList from '../modules/product/pages/ProductList';
import Login from '../modules/auth/pages/Login';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      { path: '', element: <Login /> }
    ]
  },
  {
    path: '/',
    element: <PrivateRoute allowedRoles={['superadmin', 'admin']} />,
    children: [
      { path: '', element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      // Product Group
      { path: 'products', element: <ProductList /> },
      // Users, Orders, Settings, etc... will be mapped here
    ]
  },
  // Setting up specific superadmin route
  {
    path: '/system',
    element: <PrivateRoute allowedRoles={['superadmin']} />,
    children: [
      { path: 'settings', element: <div className="page-content">Hệ thống Cài đặt chuyên môn superadmin</div> }
    ]
  },
  {
    path: '*',
    element: <div>404 Not Found</div>
  }
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
