import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppNotify } from '@/hooks/useAppNotify';
import { useAppConfirm } from '@/hooks/useAppConfirm';
import {
  useGetShiftListQuery,
  useDeleteShiftMutation,
  useBatchDeleteShiftsMutation,
  useSwitchShiftStatusMutation,
} from '../api/shiftApi';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import { cleanParams } from '@/utils/api';

export const useShiftList = () => {
  const { t } = useTranslation(['shift', 'translation']);
  const { notification } = useAppNotify();
  const { confirmDelete, confirmBatchDelete } = useAppConfirm();
  const { goToShiftCreate, goToShiftEdit } = useAppNavigate() as any;

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

  const { data, isLoading, isFetching, refetch } = useGetShiftListQuery(apiParams, {
    skip: !isReady,
  });

  const [deleteShift, { isLoading: isDeleting }] = useDeleteShiftMutation();
  const [batchDeleteShifts, { isLoading: isBatchDeleting }] = useBatchDeleteShiftsMutation();
  const [switchShiftStatus] = useSwitchShiftStatusMutation();

  const handleDelete = useCallback(async (id: string) => {
    confirmDelete({
      onOk: async () => {
        try {
          await deleteShift(id).unwrap();
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
  }, [confirmDelete, deleteShift, notification, t]);

  const handleBatchDelete = useCallback(async () => {
    if (selectedIds.length === 0) return;
    confirmBatchDelete(selectedIds.length, async () => {
      try {
        await batchDeleteShifts(selectedIds).unwrap();
        notification.success({
          title: t('common.messages.success', { ns: 'translation' }),
          description: t('messages.deleteSuccess'), // Reuse delete success
        });
        setSelectedIds([]);
      } catch (error: any) {
        notification.error({
          title: t('common.messages.error', { ns: 'translation' }),
          description: error?.data?.message || t('messages.deleteError'),
        });
      }
    });
  }, [selectedIds, confirmBatchDelete, batchDeleteShifts, notification, t]);

  const handleSwitchStatus = useCallback(async (id: string, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      await switchShiftStatus({ id, status: newStatus }).unwrap();
      notification.success({
        title: t('common.messages.success', { ns: 'translation' }),
        description: t('messages.statusSuccess'),
      });
    } catch (error: any) {
      notification.error({
        title: t('common.messages.error', { ns: 'translation' }),
        description: error?.data?.message || t('messages.statusError'),
      });
    }
  }, [switchShiftStatus, notification, t]);

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
    total: data?.result?.pagination?.total || 0,
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
    handleSwitchStatus,
    handlePageChange,
    handleSearch,
    handleStatusChange,
    handleBranchChange,
    goToShiftCreate,
    goToShiftEdit,
    t,
  };
};
