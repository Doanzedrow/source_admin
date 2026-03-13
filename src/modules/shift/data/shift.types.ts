export interface Shift {
  _id: string;
  name: string;
  startTime: string;
  endTime: string;
  status: number;
  branch?: {
    _id: string;
    code: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface ShiftListParams {
  page?: number;
  page_size?: number;
  keyword?: string;
  status?: number;
  branchId?: string;
}

export interface PaginatedShiftResult {
  data: Shift[];
  pagination: {
    total: number;
    current_page: number;
    page_size: number;
    total_page: number;
  };
}

export interface ShiftListResponse {
  status: string;
  message: string;
  result: PaginatedShiftResult;
}

export interface ShiftResponse {
  status: string;
  message: string;
  result: Shift;
}
