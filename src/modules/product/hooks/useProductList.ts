import { useState } from 'react';
import { mockProductData } from '../data/productMockData';
import type { ProductMock } from '../data/productMockData';

// Hook Contains Logic
export const useProductList = () => {
  const [data, setData] = useState<ProductMock[]>(mockProductData);

  const handleDelete = (key: number) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
  };

  const handleEdit = (key: number) => {
    console.log('Edit product Id:', key);
  };

  return {
    data,
    handleDelete,
    handleEdit,
  };
};
