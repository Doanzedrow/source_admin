
export interface Order {
  _id: string;
  id?: number;
  code?: string;
  orderCode?: string;
  createdAt: string;
  updatedAt: string;
  customer?: {
    fullname?: string;
    name?: string;
    phone?: string;
  };
  branch?: {
    _id: string;
    code: string;
    name: string;
  };
  totalAmount?: number;
  value?: number;
  expectedDeliveryDate?: string;
  deliveryDate?: string;
  deadline?: string;
  orderStatus?: number;
  status?: number;
  paymentStatus?: number;
  depositAmount?: number;
  remainingAmount?: number;
  [key: string]: any;
}

export interface PaginatedOrderResult {
  data: Order[];
  pagination?: {
    total: number;
    current_page: number;
    page_size: number;
    total_page: number;
  };
  total?: number;
  metaData?: {
    totalPaid?: number;
    totalDeposit?: number;
    totalRemaining?: number;
    totalAmount?: number;
    totalDiscount?: number;
    totalGivenMoney?: number;
    totalChangeMoney?: number;
    totalDebt?: number;
    totalReturn?: number;
    [key: string]: any;
  }
}

export interface OrderListParams {
  page?: number;
  page_size?: number;
  keyword?: string;
  status?: number;
  paymentStatus?: number;
  startDate?: string;
  endDate?: string;
  branchId?: string;
  type?: number;
}
