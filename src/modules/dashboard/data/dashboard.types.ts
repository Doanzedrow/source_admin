export interface TodayStatisticsResult {
  revenue?: number;
  orders?: number;
  refunds?: number;
  refundCount?: number;
  deposits?: number;
  depositCount?: number;
  netGrowth?: number;
}

export interface RecentActivity {
  id: string | number;
  description: string;
  createdAt: string;
}

export interface DashboardResponse<T> {
  success: boolean;
  message: string;
  result: T;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
