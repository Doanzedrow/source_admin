import { useState, useCallback, useMemo, useEffect, useDeferredValue } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppNotify } from '@/hooks/useAppNotify';
import { useAppConfirm } from '@/hooks/useAppConfirm';
import { 
  useGetCategoryListQuery, 
  useSwitchCategoryStatusMutation,
  useDeleteCategoryMutation,
  useBatchDeleteCategoriesMutation
} from '../api/categoryApi';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { useAppNavigate } from '@/hooks/useAppNavigate';

export const useCategoryList = () => {
  const { t } = useTranslation(['category', 'translation']);
  const { notification } = useAppNotify();
  const { confirmDelete, confirmBatchDelete } = useAppConfirm();
  const { goToCategoryCreate, goToCategoryEdit } = useAppNavigate();
  
  const { filters, setFilters, resetFilters } = useUrlFilters({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
    keyword: '',
    status: undefined as number | undefined,
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [switchingId, setSwitchingId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const { data, isLoading, isFetching } = useGetCategoryListQuery(filters);
  const [switchStatus] = useSwitchCategoryStatusMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [batchDeleteCategories, { isLoading: isBatchDeleting }] = useBatchDeleteCategoriesMutation();

  const handlePageChange = useCallback((page: number, pageSize?: number) => {
    setFilters({
      page,
      page_size: pageSize || filters.page_size,
    });
  }, [filters.page_size, setFilters]);

  const handleSearch = useCallback((val: string) => {
    setFilters({ keyword: val, page: 1 });
  }, [setFilters]);

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
    } finally {
      setSwitchingId(null);
    }
  }, [switchStatus, notification, t]);

  const handleDelete = useCallback((id: string) => {
    confirmDelete({
      onOk: async () => {
        try {
          await deleteCategory(id).unwrap();
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
  }, [confirmDelete, deleteCategory, notification, t]);

  const handleBatchDelete = useCallback((ids: string[], onSuccess?: () => void) => {
    if (ids.length === 0) return;

    confirmBatchDelete(ids.length, async () => {
      try {
        await batchDeleteCategories(ids).unwrap();
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
  }, [confirmBatchDelete, batchDeleteCategories, notification, t]);

  const rowSelection = useMemo(() => ({
    type: 'checkbox' as const,
    selectedRowKeys: selectedIds,
    onChange: (keys: React.Key[]) => setSelectedIds(keys as string[]),
    preserveSelectedRowKeys: true,
  }), [selectedIds]);

  const rawData = data?.result?.data || [];
  const deferredData = useDeferredValue(rawData);

  return {
    data: deferredData,
    isLoading: isLoading || isDeleting || isBatchDeleting,
    isFetching,
    isReady,
    switchingId,
    handleDelete,
    handleBatchDelete,
    handleSwitchStatus,
    handleSearch,
    params: filters,
    setFilters,
    resetFilters,
    handlePageChange,
    total: data?.result?.pagination?.total || 0,
    t,
    rowSelection,
    selectedIds,
    setSelectedIds,
    goToCategoryCreate,
    goToCategoryEdit,
  };
};
