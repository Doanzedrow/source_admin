
export enum OrderStatus {
  Draft = 0,
  InProduction = 1,
  Produced = 2,
  Delivered = 3,
  Refunded = 4,
  Canceled = 5,
}

const orderStatusMap = new Map(
  [
    {
      id: OrderStatus.Draft,
      name: 'draft',
      label: 'Đang thực hiện',
      backgroundColor: '#f5f5f5',
      textColor: '#595959',
    },
    {
      id: OrderStatus.InProduction,
      name: 'inProduction',
      label: 'Đang sản xuất',
      backgroundColor: '#e6f7ff',
      textColor: '#1890ff',
    },
    {
      id: OrderStatus.Produced,
      name: 'produced',
      label: 'Đã sản xuất',
      backgroundColor: '#f6ffed',
      textColor: '#52c41a',
    },
    {
      id: OrderStatus.Delivered,
      name: 'delivered',
      label: 'Đã giao hàng',
      backgroundColor: '#f6ffed',
      textColor: '#52c41a',
    },
    {
      id: OrderStatus.Refunded,
      name: 'refunded',
      label: 'Đã hoàn lại',
      backgroundColor: '#fff7e6',
      textColor: '#d46b08',
    },
    {
      id: OrderStatus.Canceled,
      name: 'canceled',
      label: 'Đã hủy',
      backgroundColor: '#fff1f0',
      textColor: '#cf1322',
    },
  ].map((item) => [item.id, item])
);

export const getOrderStatus = (status: OrderStatus) => {
  return orderStatusMap.get(status);
};

export enum PaymentStatus {
  Error = -1,
  Unpaid = 0,
  Paid = 1,
  Deposit = 2,
}

const paymentStatusMap = new Map(
  [
    {
      id: PaymentStatus.Error,
      name: 'error',
      label: 'Lỗi',
      backgroundColor: '#fff1f0',
      textColor: '#cf1322',
    },
    {
      id: PaymentStatus.Unpaid,
      name: 'unpaid',
      label: 'Chưa thanh toán',
      backgroundColor: '#fff1f0',
      textColor: '#cf1322',
    },
    {
      id: PaymentStatus.Paid,
      name: 'paid',
      label: 'Đã thanh toán',
      backgroundColor: '#f6ffed',
      textColor: '#52c41a',
    },
    {
      id: PaymentStatus.Deposit,
      name: 'deposit',
      backgroundColor: '#fff7e6',
      textColor: '#d46b08',
      label: 'Đặt cọc',
    },
  ].map((item) => [item.id, item])
);

export const getPaymentStatus = (status: PaymentStatus) => {
  return paymentStatusMap.get(status);
};
