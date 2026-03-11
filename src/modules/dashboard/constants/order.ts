import { APP_COLOR_PRIMARY } from '@/config/constants';

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
      backgroundColor: '#f1f1f1',
      textColor: '#777777',
    },
    {
      id: OrderStatus.InProduction,
      name: 'inProduction',
      label: 'Đang sản xuất',
      backgroundColor: APP_COLOR_PRIMARY,
      textColor: 'white',
    },
    {
      id: OrderStatus.Produced,
      name: 'produced',
      label: 'Đã sản xuất',
      backgroundColor: '#53A451',
      textColor: 'white',
    },
    {
      id: OrderStatus.Delivered,
      name: 'delivered',
      label: 'Đã giao hàng',
      backgroundColor: APP_COLOR_PRIMARY,
      textColor: 'white',
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
      backgroundColor: '#ffff0078',
      textColor: '#ff0000',
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
      backgroundColor: '#ffff0078',
      textColor: '#ff0000',
      label: 'Lỗi',
    },
    {
      id: PaymentStatus.Unpaid,
      name: 'unpaid',
      backgroundColor: '#ff00002b',
      textColor: '#FF0000',
      label: 'Chưa thanh toán',
    },
    {
      id: PaymentStatus.Paid,
      name: 'paid',
      backgroundColor: '#dff0e6',
      textColor: '#27ae61',
      label: 'Đã thanh toán',
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
