export interface TodayStatisticsResult {
  totalSaleRevenue?: number;
  totalSaleOrders?: number;
  totalDepositRevenue?: number;
  totalDepositOrders?: number;
  totalReturnRevenue?: number;
  totalReturnOrders?: number;
  totalYesterdaySaleRevenue?: number;
  percentChangeYesterday?: number;
  totalPrevSaleRevenue?: number;
  percentChangeSamePeriod?: number;
}

export interface RecentActivity {
  _id: string;
  branch?: {
    _id: string;
    code: string;
    name: string;
  };
  implementer?: {
    _id: string;
    fullname: string;
    id: string;
  };
  order?: {
    _id: string;
    code: string;
    totalAmount: number;
  } | null;
  orderCode?: string;
  time?: string;
  subjectType?: string;
  action?: string;
  activity?: string;
  description?: string;
  value?: number;
  createdAt: string;
  updatedAt: string;
  id: number;
}

export interface DashboardResponse<T> {
  success: boolean;
  message: string;
  result: T;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination?: {
    total: number;
    current_page: number;
    page_size: number;
    total_page: number;
  };
  total?: number;
  page?: number;
  limit?: number;
}

export interface ChartNetRevenueData {
  label: string;
  total: number;
}

export interface ChartNetRevenueResult {
  totalNetRevenue: number;
  datas: ChartNetRevenueData[];
}

export interface NetRevenueParams {
  startDate: string;
  endDate: string;
  type: 'day' | 'hour' | 'weekday';
}

export interface ChartLabelTotalData {
  label: string;
  total: number;
}

export interface TopProductParams {
  startDate: string;
  endDate: string;
  type: 'revenue' | 'quantity';
}

export interface TopCustomerParams {
  startDate: string;
  endDate: string;
}

export interface DashboardOrderParams {
  page: number;
  page_size: number;
  type: number;
  startDate: string;
  endDate: string;
}

export interface DashboardOrder {
  _id: string;
  id?: number;
  code?: string;
  orderCode?: string;
  createdAt: string;
  customer?: {
    fullname?: string;
    name?: string;
    phone?: string;
  };
  totalAmount?: number;
  value?: number;
  expectedDeliveryDate?: string;
  deliveryDate?: string;
  orderStatus?: number;
  status?: number;
  paymentStatus?: number;
  depositAmount?: number;
  remainingAmount?: number;
  [key: string]: any;
}
