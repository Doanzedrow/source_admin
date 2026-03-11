import { useState, useMemo, useCallback } from 'react';
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
  const { data: categoriesData } = useGetAllCategoriesQuery({ type: 1 });
  const categories = useMemo(() => categoriesData?.result || [], [categoriesData]);

  // Create a memoized map for O(1) category lookup
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach(c => map.set(c.code, c._id));
    return map;
  }, [categories]);

  const apiParams = useMemo(() => {
    const params = { ...filters };
    
    // Quick lookup using Map instead of .find()
    if (params.category) {
      const categoryId = categoryMap.get(params.category);
      if (categoryId) {
        params.category = categoryId;
      }
    }
    
    if (params.status !== undefined && params.status !== null) {
      params.status = Number(params.status);
    }
    
    return params;
  }, [filters, categoryMap]);

  const isCategoryReady = !filters.category || (filters.category && categories.some(c => c.code === filters.category));

  const { data, isLoading, isFetching } = useGetProductListQuery(apiParams, {
    skip: !isCategoryReady && categories.length === 0,
  });
  const [switchStatus] = useSwitchStatusMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [batchDeleteProducts, { isLoading: isBatchDeleting }] = useBatchDeleteProductsMutation();
  const { confirmDelete, confirmBatchDelete } = useAppConfirm();

  const handlePageChange = useCallback((page: number, pageSize?: number) => {
    setFilters({
      page,
      page_size: pageSize || filters.page_size,
    });
  }, [filters.page_size, setFilters]);

  const handleDelete = useCallback((id: string) => {
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
  }, [confirmDelete, deleteProduct, notification, t]);

  const handleBatchDelete = useCallback((ids: string[], onSuccess?: () => void) => {
    if (ids.length === 0) return;

    confirmBatchDelete(ids.length, async () => {
      try {
        await batchDeleteProducts(ids).unwrap();
        notification.success({
          message: t('common.messages.success', { ns: 'translation' }),
          description: t('messages.deleteSuccess'),
        });
        onSuccess?.();
      } catch (error: any) {
        notification.error({
          message: t('messages.deleteError'),
          description: error?.data?.message || error?.message,
        });
      }
    });
  }, [confirmBatchDelete, batchDeleteProducts, notification, t]);

  const handleSwitchStatus = useCallback(async (id: string, currentStatus: number) => {
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
  }, [switchStatus, notification, t]);

  return {
    data: data?.result?.data || [],
    isLoading: isLoading || isDeleting || isBatchDeleting,
    isFetching,
    switchingId,
    handleDelete,
    handleBatchDelete,
    handleSwitchStatus,
    params: filters,
    setFilters,
    resetFilters,
    categories,
    handlePageChange,
    total: data?.result?.pagination?.total || 0,
  };
};
