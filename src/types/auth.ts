import type { Branch } from '@/modules/branch/data/branch.types';

export interface PermissionAction {
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface Permission {
  _id: string;
  name: string;
  module: string;
  actions: PermissionAction;
  status: number;
}

export interface UserRole {
  _id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  isDefault?: boolean;
}

export interface User {
  _id: string;
  userName: string;
  fullname: string;
  emailAddress?: string;
  emailVerify?: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  status: number;
  role?: UserRole;
  avatar?: string;
  gender?: number;
  branch?: Branch;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
