import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PrivateRoute } from './PrivateRoute';
import AuthLayout from '@/layouts/AuthLayout';
import { rc, RouteKey } from './routeConfig';
import { AppLoader } from '@/components/common/AppLoader/AppLoader';

const Dashboard = lazy(() => import('@/modules/dashboard/pages/Dashboard'));
const ProductList = lazy(() => import('@/modules/product/pages/ProductList'));
const Login = lazy(() => import('@/modules/auth/pages/Login'));


const Loadable = (Component: React.ComponentType<any>) => (props: any) =>
(
  <Suspense fallback={<AppLoader />}>
    <Component {...props} />
  </Suspense>
);

// Shared UI fragments with i18n
const NotFoundPage = () => {
  const { t } = useTranslation();
  return <div style={{ padding: '24px', textAlign: 'center' }}>{t('notFound')}</div>;
};

const SystemSettingsPlaceholder = () => {
  const { t } = useTranslation();
  return <div className="page-content">{t('systemSettings')}</div>;
};

const router = createBrowserRouter([
  {
    path: rc(RouteKey.Login).path,
    element: <AuthLayout />,
    children: [
      { path: '', element: Loadable(Login)({}) }
    ]
  },
  {
    path: '/',
    element: <PrivateRoute allowedRoles={['superadmin', 'admin']} />,
    children: [
      { path: '', element: <Navigate to={rc(RouteKey.Dashboard).path} replace /> },
      { path: rc(RouteKey.Dashboard).path.substring(1), element: Loadable(Dashboard)({}) },
      { path: rc(RouteKey.Products).path.substring(1), element: Loadable(ProductList)({}) },
    ]
  },
  {
    path: '/system',
    element: <PrivateRoute allowedRoles={['superadmin']} />,
    children: [
      { path: 'settings', element: <SystemSettingsPlaceholder /> }
    ]
  },
  {
    path: rc(RouteKey.NotFound).path,
    element: <NotFoundPage />
  }
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
