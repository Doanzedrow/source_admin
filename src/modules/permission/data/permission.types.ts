import type { ApiResponse } from '@/types/api';

export interface PermissionActions {
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface Permission {
  _id: string;
  id: string;
  name: string;
  module: string;
  actions: PermissionActions;
  status: number;
  createdAt?: string;
  updatedAt?: string;
}

export type PermissionListResponse = ApiResponse<Permission[]>;
export type PermissionResponse = ApiResponse<Permission>;
