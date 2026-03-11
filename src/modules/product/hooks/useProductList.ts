import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppNotify } from '@/hooks/useAppNotify';
import { useAppConfirm } from '@/hooks/useAppConfirm';
import { 
  useGetProductListQuery, 
  useSwitchStatusMutation,
  useDeleteProductMutation,
  useBatchDeleteProductsMutation
} from '../api/productApi';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { useGetAllCategoriesQuery } from '@/modules/category/api/categoryApi';

export const useProductList = () => {
  const { t } = useTranslation(['product', 'translation']);
  const { notification } = useAppNotify();
  
  const { filters, setFilters, resetFilters } = useUrlFilters({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
    keyword: '',
    category: undefined as string | undefined,
    status: undefined as number | undefined,
  });

  const [switchingId, setSwitchingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { data: categoriesData } = useGetAllCategoriesQuery({ type: 1 });

  const { data, isLoading, isFetching } = useGetProductListQuery(filters);
  const [switchStatus] = useSwitchStatusMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [batchDeleteProducts, { isLoading: isBatchDeleting }] = useBatchDeleteProductsMutation();
  const { confirmDelete, confirmBatchDelete } = useAppConfirm();

  const handlePageChange = (page: number, pageSize?: number) => {
    setFilters({
      page,
      page_size: pageSize || filters.page_size,
    });
  };

  const handleDelete = (id: string) => {
    confirmDelete({
      onOk: async () => {
        try {
          await deleteProduct(id).unwrap();
          notification.success({
            message: t('common.messages.success', { ns: 'translation' }),
            description: t('messages.deleteSuccess'),
          });
        } catch (error: any) {
          notification.error({
            message: t('messages.deleteError'),
            description: error?.data?.message || error?.message,
          });
        }
      },
    });
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;

    confirmBatchDelete(selectedIds.length, async () => {
      try {
        await batchDeleteProducts(selectedIds).unwrap();
        notification.success({
          message: t('common.messages.success', { ns: 'translation' }),
          description: t('messages.deleteSuccess'),
        });
        setSelectedIds([]);
      } catch (error: any) {
        notification.error({
          message: t('messages.deleteError'),
          description: error?.data?.message || error?.message,
        });
      }
    });
  };

  const handleSwitchStatus = async (id: string, currentStatus: number) => {
    try {
      setSwitchingId(id);
      const newStatus = currentStatus === 1 ? 0 : 1;
      await switchStatus({ id, status: newStatus }).unwrap();
      notification.success({
        message: t('common.messages.success', { ns: 'translation' }),
        description: t('messages.updateStatusSuccess'),
      });
    } catch (error: any) {
      notification.error({
        message: t('messages.updateStatusError'),
        description: error?.data?.message || error?.message,
      });
      console.error('Switch status error:', error);
    } finally {
      setSwitchingId(null);
    }
  };

  return {
    data: data?.result?.data || [],
    isLoading: isLoading || isFetching || isDeleting || isBatchDeleting,
    isFetching,
    switchingId,
    selectedIds,
    setSelectedIds,
    handleDelete,
    handleBatchDelete,
    handleSwitchStatus,
    params: filters,
    setFilters,
    resetFilters,
    categories: categoriesData?.result || [],
    handlePageChange,
    total: data?.result?.pagination?.total || 0,
  };
};
