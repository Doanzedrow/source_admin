import type { Branch } from '@/modules/branch/data/branch.types';
import type { Role } from '@/modules/role/data/role.types';

export interface User {
  _id: string;
  id?: string;
  userName: string;
  fullname: string;
  birthday?: string;
  gender?: number; // 0: None, 1: Male, 2: Female
  isSuperAdmin: boolean;
  isAdmin: boolean;
  emailVerify: boolean;
  activationKey?: string;
  status: number; // 1: Active, 0: Inactive
  role: string | Role;
  isDefault: boolean;
  branch?: string | Branch;
  address?: string;
  emailAddress?: string;
  phone?: string;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedUserResult {
  data: User[];
  pagination?: {
    total: number;
    current_page: number;
    page_size: number;
    total_page: number;
  };
  total?: number;
}

export interface UserListParams {
  page?: number;
  page_size?: number;
  keyword?: string;
  status?: number;
  branchId?: string;
}
