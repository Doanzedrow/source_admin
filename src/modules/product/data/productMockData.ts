export interface ProductMock {
  key: number;
  name: string;
  category: string;
  price: string;
}

export const mockProductData: ProductMock[] = [
  { key: 1, name: 'Sản phẩm 1', category: 'Thiết bị điện tử', price: '1,000,000 VND' },
  { key: 2, name: 'Sản phẩm 2', category: 'Thời trang', price: '500,000 VND' },
  { key: 3, name: 'Sản phẩm 3', category: 'Thiết bị thông minh', price: '1,500,000 VND' },
];
