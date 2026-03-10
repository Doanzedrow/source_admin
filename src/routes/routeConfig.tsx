import React from 'react';
import { generatePath } from 'react-router-dom';
import * as Icon from '@ant-design/icons';

/**
 * @file App route configuration system.
 * Professional management for application-wide routing, avoiding hardcoded strings.
 */

export const RouteKey = {
  Login: 'login',
  Dashboard: 'dashboard',
  Products: 'products',
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
}

const routesArray: RouteConfig[] = [
  {
    id: RouteKey.Login,
    name: 'Login',
    path: '/login',
  },
  {
    id: RouteKey.Dashboard,
    name: 'Dashboard',
    path: '/dashboard',
    icon: <Icon.DashboardOutlined />,
  },
  {
    id: RouteKey.Products,
    name: 'Products',
    path: '/products',
    icon: <Icon.ShoppingOutlined />,
  },
  {
    id: RouteKey.Settings,
    name: 'Settings',
    path: '/system/settings',
    icon: <Icon.SettingOutlined />,
  },
  {
    id: RouteKey.NotFound,
    name: '404 Not Found',
    path: '*',
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

/**
 * Get route config by exact path.
 */
export const rcByPath = (routePath: string) => {
  return Array.from(routeMap.values()).find((route) => route.path === routePath);
};

/**
 * Check if a path matches a specific route key.
 */
export const isRoute = (routePath: string, routeKey: RouteKeyType) => {
  return routeMap.get(routeKey)?.path === routePath;
};

/**
 * Get route by subpath or path.
 */
export const getRouteBySubpath = (subpath: string) => {
  const routeArray = Array.from(routeMap.values());
  return routeArray.find((route) =>
    route.subPath ? route.subPath === subpath : route.path === subpath
  );
};

/**
 * Professional path generator with optional parameters.
 * Example of use: generateAppPath(RouteKey.OrderDetail, { id: '123' })
 */
export const generateAppPath = (routeKey: RouteKeyType, params?: Record<string, string | number>) => {
  const route = rc(routeKey);
  if (params) {
    return generatePath(route.path, params);
  }
  return route.path;
};
