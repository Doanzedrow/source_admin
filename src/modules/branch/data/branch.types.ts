import type { ApiResponse, PaginatedResult } from '@/types/api';

export interface Branch {
  _id: string;
  code: string;
  name: string;
  status: number;
  id: number;
  phone?: string;
  address?: string;
  email?: string;
  deletedAt?: string | null;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string | null;
  extends?: any[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export type BranchListResponse = ApiResponse<{ data: Branch[] }>;
export type BranchPaginationResponse = ApiResponse<PaginatedResult<Branch>>;
