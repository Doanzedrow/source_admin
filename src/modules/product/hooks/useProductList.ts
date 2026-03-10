import { useState } from 'react';
import { mockProductData } from '@/modules/product/data/productMockData';
import type { ProductMock } from '@/modules/product/data/productMockData';

// Hook Contains Logic
export const useProductList = () => {
  const [data, setData] = useState<ProductMock[]>(mockProductData);
  const [isLoading] = useState(false); // Mock loading state

  const handleDelete = (key: number) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
  };

  const handleEdit = (key: number) => {
    console.log('Edit product Id:', key);
  };

  return {
    data,
    isLoading,
    handleDelete,
    handleEdit,
  };
};
