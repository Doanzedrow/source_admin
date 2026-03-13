import type { ApiResponse } from '@/types/api';
import type { Permission } from '../../permission/data/permission.types';

export interface Role {
  _id: string;
  id: number | string;
  name: string;
  description: string;
  status: number;
  isAdmin: boolean;
  permissions: Permission[];
  branch?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export type RoleListResponse = ApiResponse<Role[]>;
export type RoleResponse = ApiResponse<Role>;
