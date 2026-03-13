
export enum OrderStatus {
  Draft = 0,
  InProduction = 1,
  Produced = 2,
  Delivered = 3,
  Refunded = 4,
  Canceled = 5,
}

export const getOrderStatus = (status: number) => {
  const map = new Map([
    [OrderStatus.Draft, { name: 'draft', backgroundColor: '#f5f5f5', textColor: '#595959' }],
    [OrderStatus.InProduction, { name: 'inProduction', backgroundColor: '#e6f7ff', textColor: '#1890ff' }],
    [OrderStatus.Produced, { name: 'produced', backgroundColor: '#f6ffed', textColor: '#52c41a' }],
    [OrderStatus.Delivered, { name: 'delivered', backgroundColor: '#f6ffed', textColor: '#52c41a' }],
    [OrderStatus.Refunded, { name: 'refunded', backgroundColor: '#fff7e6', textColor: '#d46b08' }],
    [OrderStatus.Canceled, { name: 'canceled', backgroundColor: '#fff1f0', textColor: '#cf1322' }],
  ]);
  return map.get(status);
};

export enum PaymentStatus {
  Error = -1,
  Unpaid = 0,
  Paid = 1,
  Deposit = 2,
}

export const getPaymentStatus = (status: number) => {
  const map = new Map([
    [PaymentStatus.Error, { name: 'error', backgroundColor: '#fff1f0', textColor: '#cf1322' }],
    [PaymentStatus.Unpaid, { name: 'unpaid', backgroundColor: '#fff1f0', textColor: '#cf1322' }],
    [PaymentStatus.Paid, { name: 'paid', backgroundColor: '#f6ffed', textColor: '#52c41a' }],
    [PaymentStatus.Deposit, { name: 'deposit', backgroundColor: '#fff7e6', textColor: '#d46b08' }],
  ]);
  return map.get(status);
};
