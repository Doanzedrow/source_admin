import { useGetProductListQuery } from '../api/productApi';

export const useProductList = () => {
  const { data, isLoading } = useGetProductListQuery({ page: 1, page_size: 20 });

  const handleDelete = (id: string) => {
    console.log('Delete product Id:', id);
  };

  const handleEdit = (id: string) => {
    console.log('Edit product Id:', id);
  };

  return {
    data: data?.result?.data || [],
    isLoading,
    handleDelete,
    handleEdit,
  };
};
