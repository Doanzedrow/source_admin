import { APP_COLOR_PRIMARY } from '@/config/constants';

export enum OrderStatus {
  Draft = 0, // đang thực hiện
  InProduction = 1, // đang sản xuất
  Produced = 2, // đã sản xuất
  Delivered = 3, // đã giao hàng
  Refunded = 4, // đã hoàn lại
  Canceled = 5, // đã hủy
}

export const OrderStatuses = [
  {
    id: OrderStatus.Draft,
    name: 'draft',
    value: 0,
    backgroundColor: '#f1f1f1',
    textColor: '#777777',
    label: 'Đang thực hiện',
  },
  {
    id: OrderStatus.Delivered,
    name: 'delivered',
    label: 'Đã giao hàng',
    backgroundColor: APP_COLOR_PRIMARY,
    textColor: 'white',
    value: 3,
  },
  {
    id: OrderStatus.Refunded,
    name: 'refunded',
    label: 'Đã hoàn lại',
    backgroundColor: '#fff7e6',
    textColor: '#d46b08',
    value: 4,
  },
  {
    id: OrderStatus.Canceled,
    name: 'canceled',
    label: 'Đã hủy',
    backgroundColor: '#ffff0078',
    textColor: '#ff0000',
    value: 5,
  },
];

const FullOrderStatuses = [
  ...OrderStatuses,
  {
    order: OrderStatus.InProduction,
    id: OrderStatus.InProduction,
    name: 'inProduction',
    label: 'Đang sản xuất',
    backgroundColor: APP_COLOR_PRIMARY,
    textColor: 'white',
  },
  {
    order: OrderStatus.Produced,
    id: OrderStatus.Produced,
    name: 'produced',
    label: 'Đã sản xuất',
    backgroundColor: '#53A451',
    textColor: 'white',
  },
];

const orderStatusMap = new Map(
  FullOrderStatuses.map((item: any) => [item.id, item])
);

export const getOrderStatus = (status: OrderStatus) => {
  return orderStatusMap.get(status);
};

export const orderStatuses = Array.from(orderStatusMap.values());

export enum OrderTypeState {
  Sale = 0,
  Deposit = 1,
  Exchange = 2,
}

export const OrderTypeOptions = [
  {
    id: OrderTypeState.Sale,
    name: 'sale',
    label: 'Thanh toán đầy đủ',
    value: 0,
  },
  {
    id: OrderTypeState.Deposit,
    name: 'deposit',
    label: 'Đặt cọc',
    value: 1,
  },
];

const orderTypeMap = new Map(
  OrderTypeOptions.map((item) => [item.id, item])
);

export const getOrderType = (status: OrderTypeState) => {
  return orderTypeMap.get(status);
};

export const orderTypes = Array.from(orderTypeMap.values());

export enum PaymentStatus {
  Error = -1,
  Unpaid = 0,
  Paid = 1,
  Deposit = 2,
}

export const getPaymentStatus = (status: number) => {
  const map = new Map([
    [PaymentStatus.Error, { name: 'error', backgroundColor: '#fff1f0', textColor: '#cf1322', label: 'Lỗi' }],
    [PaymentStatus.Unpaid, { name: 'unpaid', backgroundColor: '#fff1f0', textColor: '#cf1322', label: 'Chưa thanh toán' }],
    [PaymentStatus.Paid, { name: 'paid', backgroundColor: '#f6ffed', textColor: '#52c41a', label: 'Đã thanh toán' }],
    [PaymentStatus.Deposit, { name: 'deposit', backgroundColor: '#fff7e6', textColor: '#d46b08', label: 'Đặt cọc' }],
  ]);
  return map.get(status);
};
