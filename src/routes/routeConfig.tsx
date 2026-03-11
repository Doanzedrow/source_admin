import React, { lazy } from 'react';
import * as Icon from '@ant-design/icons';
import type { Role } from '@/types';

/**
 * @file App route configuration system.
 * Professional management for application-wide routing, avoiding hardcoded strings.
 */

export const RouteKey = {
  Login: 'login',
  Dashboard: 'dashboard',
  Products: 'products',
  ProductCreate: 'product-create',
  ProductEdit: 'product-edit',
  Settings: 'settings',
  NotFound: 'notfound',
} as const;

export type RouteKeyType = typeof RouteKey[keyof typeof RouteKey];

export interface RouteConfig {
  id: RouteKeyType;
  name: string;
  path: string;
  subPath?: string;
  icon?: React.ReactElement;
  pather?(...args: Array<any>): string;
  component?: React.ComponentType<any>;
  layout?: 'main' | 'auth' | 'none';
  allowedRoles?: Role[];
}

export const routesArray: RouteConfig[] = [
  {
    id: RouteKey.Login,
    name: 'Login',
    path: '/login',
    layout: 'auth',
    component: lazy(() => import('@/modules/auth/pages/Login')),
  },
  {
    id: RouteKey.Dashboard,
    name: 'Dashboard',
    path: '/dashboard',
    icon: <Icon.DashboardOutlined />,
    layout: 'main',
    allowedRoles: ['superadmin', 'admin'],
    component: lazy(() => import('@/modules/dashboard/pages/Dashboard')),
  },
  {
    id: RouteKey.Products,
    name: 'Products',
    path: '/products',
    icon: <Icon.ShoppingOutlined />,
    layout: 'main',
    allowedRoles: ['superadmin', 'admin'],
    component: lazy(() => import('@/modules/product/pages/ProductList')),
  },
  {
    id: RouteKey.ProductCreate,
    name: 'Create Product',
    path: '/products/create',
    layout: 'main',
    allowedRoles: ['superadmin', 'admin'],
    component: lazy(() => import('@/modules/product/pages/ProductUpsert')),
  },
  {
    id: RouteKey.ProductEdit,
    name: 'Edit Product',
    path: '/products/edit/:id',
    layout: 'main',
    allowedRoles: ['superadmin', 'admin'],
    component: lazy(() => import('@/modules/product/pages/ProductUpsert')),
  },
  {
    id: RouteKey.Settings,
    name: 'Settings',
    path: '/system/settings',
    icon: <Icon.SettingOutlined />,
    layout: 'main',
    allowedRoles: ['superadmin'],
    component: lazy(() => Promise.resolve({
      default: () => <div className="page-content">System Settings / Hệ thống Cài đặt chuyên môn</div>
    })),
  },
  {
    id: RouteKey.NotFound,
    name: '404 Not Found',
    path: '*',
    layout: 'none'
  },
];

export const routeMap: ReadonlyMap<RouteKeyType, RouteConfig> = new Map(
  routesArray.map((route) => [route.id, route])
);

/**
 * Get route config by key.
 */
export const rc = (routeKey: RouteKeyType): RouteConfig => {
  const route = routeMap.get(routeKey);
  if (!route) {
    throw new Error(`Route key ${routeKey} not found in routeMap`);
  }
  return route;
};
