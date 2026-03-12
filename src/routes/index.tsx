import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import AuthLayout from '@/layouts/AuthLayout';
import { routesArray } from './routeConfig';
import { PageLoader } from '@/components/common/PageLoader/PageLoader';
import { ErrorPage } from '@/components/common/ErrorPage';

const generateRoutes = (): RouteObject[] => {
  const routerRoutes: RouteObject[] = [];
  const mainRoutesByRole = new Map<string, { roles: string[], routes: RouteObject[], requiredPermission?: any }>();

  routesArray.forEach((route) => {
    if (route.layout === 'none' || !route.component) return;

    const Component = route.component;
    const element = (
      <Suspense fallback={<PageLoader />}>
        <Component />
      </Suspense>
    );

    if (route.layout === 'auth') {
      routerRoutes.push({
        path: route.path,
        element: <AuthLayout />,
        children: [{ path: '', element }]
      });
    } else if (route.layout === 'main') {
      const roles = route.allowedRoles || ['superadmin', 'admin'];
      const key = `${roles.slice().sort().join(',')}-${route.requiredPermission?.module || ''}-${route.requiredPermission?.action || ''}`;

      if (!mainRoutesByRole.has(key)) {
        mainRoutesByRole.set(key, { roles, routes: [], requiredPermission: route.requiredPermission });
      }

      mainRoutesByRole.get(key)!.routes.push({
        path: route.path.startsWith('/') ? route.path.substring(1) : route.path,
        element
      });
    }
  });


  mainRoutesByRole.forEach(({ roles, routes, requiredPermission }) => {

    const isDefaultGroup = roles.includes('admin') && roles.includes('superadmin') && !requiredPermission;

    routerRoutes.push({
      path: '/',
      element: <PrivateRoute allowedRoles={roles} requiredPermission={requiredPermission} />,
      children: [
        ...(isDefaultGroup ? [{ path: '', element: <Navigate to="/dashboard" replace /> }] : []),
        ...routes
      ]
    });
  });


  routerRoutes.push({
    path: '*',
    element: <ErrorPage status="404" />
  });

  return routerRoutes;
};

const router = createBrowserRouter(generateRoutes());

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
