import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppNotify } from '@/hooks/useAppNotify';
import { useAppConfirm } from '@/hooks/useAppConfirm';
import {
  useGetUserListQuery,
  useDeleteUserMutation,
  useBatchDeleteUsersMutation,
} from '../api/userApi';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import { cleanParams } from '@/utils/api';

export const useUserList = () => {
  const { t } = useTranslation(['user', 'translation']);
  const { notification } = useAppNotify();
  const { confirmDelete, confirmBatchDelete } = useAppConfirm();
  const { goToUserCreate, goToUserEdit } = useAppNavigate() as any;

  const { filters, setFilters, resetFilters } = useUrlFilters({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
    keyword: '',
    status: undefined as number | undefined,
    branchId: undefined as string | undefined,
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const apiParams = useMemo(() => {
    return cleanParams({ ...filters });
  }, [filters]);

  const { data, isLoading, isFetching, refetch } = useGetUserListQuery(apiParams, {
    skip: !isReady,
  });

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [batchDeleteUsers, { isLoading: isBatchDeleting }] = useBatchDeleteUsersMutation();

  const handleDelete = useCallback(async (id: string) => {
    confirmDelete({
      onOk: async () => {
        try {
          await deleteUser(id).unwrap();
          notification.success({
            title: t('common.messages.success', { ns: 'translation' }),
            description: t('messages.deleteSuccess'),
          });
        } catch (error: any) {
          notification.error({
            title: t('common.messages.error', { ns: 'translation' }),
            description: error?.data?.message || t('messages.deleteError'),
          });
        }
      },
    });
  }, [confirmDelete, deleteUser, notification, t]);

  const handleBatchDelete = useCallback(async (ids: string[], callback?: () => void) => {
    confirmBatchDelete(ids.length, async () => {
      try {
        await batchDeleteUsers(ids).unwrap();
        notification.success({
          title: t('common.messages.success', { ns: 'translation' }),
          description: t('messages.batchDeleteSuccess'),
        });
        callback?.();
      } catch (error: any) {
        notification.error({
          title: t('common.messages.error', { ns: 'translation' }),
          description: error?.data?.message || t('messages.batchDeleteError'),
        });
      }
    });
  }, [confirmBatchDelete, batchDeleteUsers, notification, t]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setFilters({ ...filters, page, page_size: pageSize || filters.page_size });
  };

  const handleSearch = (keyword: string) => {
    setFilters({ ...filters, keyword, page: 1 });
  };

  const handleStatusChange = (status?: number) => {
    setFilters({ ...filters, status, page: 1 });
  };

  const handleBranchChange = (branchId?: string) => {
    setFilters({ ...filters, branchId, page: 1 });
  };

  return {
    data: data?.result?.data || [],
    total: data?.result?.pagination?.total || data?.result?.total || 0,
    filters,
    isLoading: isLoading || isDeleting || isBatchDeleting,
    isFetching,
    refetch,
    resetFilters,
    rowSelection: {
      selectedRowKeys: selectedIds,
      onChange: (keys: any[]) => setSelectedIds(keys as string[]),
    },
    selectedIds,
    setSelectedIds,
    handleDelete,
    handleBatchDelete,
    handlePageChange,
    handleSearch,
    handleStatusChange,
    handleBranchChange,
    goToUserCreate,
    goToUserEdit,
    t,
  };
};
