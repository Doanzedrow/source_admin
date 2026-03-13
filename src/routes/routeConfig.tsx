import React, { lazy } from 'react';
import * as Icon from '@ant-design/icons';

/**
 * @file App route configuration system.
 * Professional management for application-wide routing, avoiding hardcoded strings.
 */

export const RouteKey = {
  Login: 'login',
  Dashboard: 'dashboard',
  Products: 'products',
  Category: 'category',
  CategoryCreate: 'category-create',
  CategoryEdit: 'category-edit',
  ProductCreate: 'product-create',
  ProductEdit: 'product-edit',
  Attributes: 'attributes',
  AttributeCreate: 'attribute-create',
  AttributeEdit: 'attribute-edit',
  Permission: 'permission',
  PermissionCreate: 'permission-create',
  PermissionEdit: 'permission-edit',
  Role: 'role',
  RoleCreate: 'role-create',
  RoleEdit: 'role-edit',
  Service: 'service',
  ServiceCreate: 'service-create',
  ServiceEdit: 'service-edit',
  Orders: 'orders',
  Users: 'users',
  UserCreate: 'user-create',
  UserEdit: 'user-edit',
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
  allowedRoles?: string[];
  requiredPermission?: {
    module: string;
    action?: 'view' | 'create' | 'update' | 'delete';
  };
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
    requiredPermission: { module: 'product', action: 'view' },
    component: lazy(() => import('@/modules/product/pages/ProductList')),
  },
  {
    id: RouteKey.Category,
    name: 'Categories',
    path: '/categories',
    icon: <Icon.TagsOutlined />,
    layout: 'main',
    allowedRoles: ['superadmin', 'admin'],
    requiredPermission: { module: 'category', action: 'view' },
    component: lazy(() => import('@/modules/category/pages/CategoryList')),
  },
  {
    id: RouteKey.CategoryCreate,
    name: 'Create Category',
    path: '/categories/create',
    layout: 'main',
    allowedRoles: ['superadmin', 'admin'],
    requiredPermission: { module: 'category', action: 'create' },
    component: lazy(() => import('@/modules/category/pages/CategoryUpsert')),
  },
  {
    id: RouteKey.CategoryEdit,
    name: 'Edit Category',
    path: '/categories/edit/:id',
    layout: 'main',
    allowedRoles: ['superadmin', 'admin'],
    requiredPermission: { module: 'category', action: 'update' },
    component: lazy(() => import('@/modules/category/pages/CategoryUpsert')),
  },
  {
    id: RouteKey.ProductCreate,
    name: 'Create Product',
    path: '/products/create',
    layout: 'main',
    allowedRoles: ['superadmin', 'admin'],
    requiredPermission: { module: 'product', action: 'create' },
    component: lazy(() => import('@/modules/product/pages/ProductUpsert')),
  },
  {
    id: RouteKey.ProductEdit,
    name: 'Edit Product',
    path: '/products/edit/:id',
    layout: 'main',
    allowedRoles: ['superadmin', 'admin'],
    requiredPermission: { module: 'product', action: 'update' },
    component: lazy(() => import('@/modules/product/pages/ProductUpsert')),
  },
  {
    id: RouteKey.Service,
    name: 'Services',
    path: '/services',
    icon: <Icon.CustomerServiceOutlined />,
    layout: 'main',
    allowedRoles: ['superadmin', 'admin'],
    requiredPermission: { module: 'service', action: 'view' },
    component: lazy(() => import('@/modules/service/pages/ServiceList')),
  },
  {
    id: RouteKey.ServiceCreate,
    name: 'Create Service',
    path: '/services/create',
    layout: 'main',
    allowedRoles: ['superadmin', 'admin'],
    requiredPermission: { module: 'service', action: 'create' },
    component: lazy(() => import('@/modules/service/pages/ServiceUpsert')),
  },
  {
    id: RouteKey.ServiceEdit,
    name: 'Edit Service',
    path: '/services/edit/:id',
    layout: 'main',
    allowedRoles: ['superadmin', 'admin'],
    requiredPermission: { module: 'service', action: 'update' },
    component: lazy(() => import('@/modules/service/pages/ServiceUpsert')),
  },
  {
    id: RouteKey.Orders,
    name: 'Orders',
    path: '/orders',
    icon: <Icon.FileTextOutlined />,
    layout: 'main',
    allowedRoles: ['superadmin', 'admin'],
    requiredPermission: { module: 'order', action: 'view' },
    component: lazy(() => import('@/modules/order/pages/OrderList')),
  },
  {
    id: RouteKey.Attributes,
    name: 'Attributes',
    path: '/attribute/list',
    icon: <Icon.OrderedListOutlined />,
    layout: 'main',
    allowedRoles: ['superadmin', 'admin'],
    requiredPermission: { module: 'attribute', action: 'view' },
    component: lazy(() => import('@/modules/attribute/pages/AttributeList')),
  },
  {
    id: RouteKey.AttributeCreate,
    name: 'Create Attribute',
    path: '/attribute/create',
    layout: 'main',
    allowedRoles: ['superadmin', 'admin'],
    component: lazy(() => import('@/modules/attribute/pages/AttributeUpsert')),
  },
  {
    id: RouteKey.AttributeEdit,
    name: 'Edit Attribute',
    path: '/attribute/edit/:id',
    layout: 'main',
    allowedRoles: ['superadmin', 'admin'],
    component: lazy(() => import('@/modules/attribute/pages/AttributeUpsert')),
  },
  {
    id: RouteKey.Permission,
    name: 'Permissions',
    path: '/permission/list',
    icon: <Icon.SafetyCertificateOutlined />,
    layout: 'main',
    allowedRoles: ['superadmin'],
    component: lazy(() => import('@/modules/permission/pages/PermissionList')),
  },
  {
    id: RouteKey.PermissionCreate,
    name: 'Create Permission',
    path: '/permission/add',
    layout: 'main',
    allowedRoles: ['superadmin'],
    component: lazy(() => import('@/modules/permission/pages/PermissionUpsert')),
  },
  {
    id: RouteKey.PermissionEdit,
    name: 'Edit Permission',
    path: '/permission/edit/:id',
    layout: 'main',
    allowedRoles: ['superadmin'],
    component: lazy(() => import('@/modules/permission/pages/PermissionUpsert')),
  },
  {
    id: RouteKey.Role,
    name: 'Roles',
    path: '/role/list',
    icon: <Icon.TeamOutlined />,
    layout: 'main',
    allowedRoles: ['superadmin'],
    component: lazy(() => import('@/modules/role/pages/RoleList')),
  },
  {
    id: RouteKey.RoleCreate,
    name: 'Create Role',
    path: '/role/add',
    layout: 'main',
    allowedRoles: ['superadmin'],
    component: lazy(() => import('@/modules/role/pages/RoleUpsert')),
  },
  {
    id: RouteKey.RoleEdit,
    name: 'Edit Role',
    path: '/role/edit/:id',
    layout: 'main',
    allowedRoles: ['superadmin'],
    component: lazy(() => import('@/modules/role/pages/RoleUpsert')),
  },
  {
    id: RouteKey.Users,
    name: 'Users',
    path: '/users',
    icon: <Icon.UserOutlined />,
    layout: 'main',
    allowedRoles: ['superadmin', 'admin'],
    requiredPermission: { module: 'user', action: 'view' },
    component: lazy(() => import('@/modules/user/pages/UserList')),
  },
  {
    id: RouteKey.UserCreate,
    name: 'Create User',
    path: '/users/create',
    layout: 'main',
    allowedRoles: ['superadmin', 'admin'],
    requiredPermission: { module: 'user', action: 'create' },
    component: lazy(() => import('@/modules/user/pages/UserUpsert')),
  },
  {
    id: RouteKey.UserEdit,
    name: 'Edit User',
    path: '/users/edit/:id',
    layout: 'main',
    allowedRoles: ['superadmin', 'admin'],
    requiredPermission: { module: 'user', action: 'update' },
    component: lazy(() => import('@/modules/user/pages/UserUpsert')),
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
