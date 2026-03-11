import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppNotify } from '@/hooks/useAppNotify';
import { useAppConfirm } from '@/hooks/useAppConfirm';
import { 
  useGetCategoryListQuery, 
  useSwitchCategoryStatusMutation,
  useDeleteCategoryMutation
} from '../api/categoryApi';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';
import { useUrlFilters } from '@/hooks/useUrlFilters';

export const useCategoryList = () => {
  const { t } = useTranslation(['category', 'translation']);
  const { notification } = useAppNotify();
  const { confirmDelete } = useAppConfirm();
  
  const { filters, setFilters, resetFilters } = useUrlFilters({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
    keyword: '',
    status: undefined as number | undefined,
  });

  const [switchingId, setSwitchingId] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useGetCategoryListQuery(filters);
  const [switchStatus] = useSwitchCategoryStatusMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const handlePageChange = useCallback((page: number, pageSize?: number) => {
    setFilters({
      page,
      page_size: pageSize || filters.page_size,
    });
  }, [filters.page_size, setFilters]);

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

  return {
    data: data?.result?.data || [],
    isLoading: isLoading || isDeleting,
    isFetching,
    switchingId,
    handleDelete,
    handleSwitchStatus,
    params: filters,
    setFilters,
    resetFilters,
    handlePageChange,
    total: data?.result?.pagination?.total || 0,
  };
};
