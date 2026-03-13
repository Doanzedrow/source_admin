import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useAppNotify } from '@/hooks/useAppNotify';
import { useAppConfirm } from '@/hooks/useAppConfirm';
import { 
  useGetOrderListQuery, 
  useDeleteOrderMutation, 
  useBatchDeleteOrdersMutation,
  useImportOrderMutation,
  generateOrderExportUrl 
} from '../api/orderApi';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import axiosInstance from '@/utils/axiosInstance';
import { cleanParams } from '@/utils/api';

export const useOrderList = () => {
  const { t } = useTranslation(['order', 'translation']);
  const { notification } = useAppNotify();
  const { confirmDelete, confirmBatchDelete } = useAppConfirm();

  const { filters, setFilters, resetFilters } = useUrlFilters({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
    keyword: '',
    status: undefined as number | undefined,
    paymentStatus: undefined as number | undefined,
    branchId: undefined as string | undefined,
    startDate: dayjs().format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
    startHour: '05:00',
    endHour: '22:00',
    type: 0 as number | undefined, // 0: All, 1: Deposit, etc.
    userId: undefined as string | undefined,
    shiftId: undefined as string | undefined,
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const apiParams = useMemo(() => {
    return cleanParams({ ...filters });
  }, [filters]);

  const { data, isLoading, isFetching, refetch } = useGetOrderListQuery(apiParams, {
    skip: !isReady,
  });

  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  const [batchDeleteOrders, { isLoading: isBatchDeleting }] = useBatchDeleteOrdersMutation();
  const [importOrder, { isLoading: isImporting }] = useImportOrderMutation();

  const handleImport = useCallback(async (file: File) => {
    try {
      await importOrder(file).unwrap();
      notification.success({
        title: t('common.messages.success', { ns: 'translation' }),
        description: t('messages.importSuccess'),
      });
      return true;
    } catch (error: any) {
      notification.error({
        title: t('common.messages.error', { ns: 'translation' }),
        description: error?.data?.message || t('messages.importError'),
      });
      return false;
    }
  }, [importOrder, notification, t]);

  const handleExport = useCallback(async () => {
    try {
      setIsExporting(true);
      const url = generateOrderExportUrl();
      const response = await axiosInstance.post(url, cleanParams(apiParams), {
        responseType: 'blob',
      }) as any;
      
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `orders_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error: any) {
      notification.error({
        title: t('common.messages.error', { ns: 'translation' }),
        description: error?.message || 'Export failed',
      });
    } finally {
      setIsExporting(false);
    }
  }, [apiParams, notification, t]);

  const handleDelete = useCallback(async (id: string) => {
    confirmDelete({
      onOk: async () => {
        try {
          await deleteOrder(id).unwrap();
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
  }, [confirmDelete, deleteOrder, notification, t]);

  const handleBatchDelete = useCallback(async () => {
    if (selectedIds.length === 0) return;
    confirmBatchDelete(selectedIds.length, async () => {
      try {
        await batchDeleteOrders(selectedIds).unwrap();
        notification.success({
          title: t('common.messages.success', { ns: 'translation' }),
          description: t('messages.batchDeleteSuccess'),
        });
        setSelectedIds([]);
      } catch (error: any) {
        notification.error({
          title: t('common.messages.error', { ns: 'translation' }),
          description: error?.data?.message || t('messages.batchDeleteError'),
        });
      }
    });
  }, [selectedIds, confirmBatchDelete, batchDeleteOrders, notification, t]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setFilters({ ...filters, page, page_size: pageSize || filters.page_size });
  };

  const handleSearch = (keyword: string) => {
    setFilters({ ...filters, keyword, page: 1 });
  };

  const handleStatusChange = (status?: number) => {
    setFilters({ ...filters, status, page: 1 });
  };

  const handlePaymentStatusChange = (paymentStatus?: number) => {
    setFilters({ ...filters, paymentStatus, page: 1 });
  };

  const handleDateChange = (startDate?: string, endDate?: string, startHour?: string, endHour?: string) => {
    setFilters({ ...filters, startDate, endDate, startHour, endHour, page: 1 });
  };

  const handleBranchChange = (branchId?: string) => {
    setFilters({ ...filters, branchId, page: 1 });
  };

  const handleUserChange = (userId?: string) => {
    setFilters({ ...filters, userId, page: 1 });
  };

  const handleShiftChange = (shiftId?: string) => {
    setFilters({ ...filters, shiftId, page: 1 });
  };

  const handleTypeChange = (type?: number) => {
    setFilters({ ...filters, type: type ?? 0, page: 1 });
  };

  return {
    data: data?.result?.data || [],
    total: data?.result?.pagination?.total || data?.result?.total || 0,
    metaData: data?.result?.metaData || {},
    filters,
    isLoading: isLoading || isDeleting || isBatchDeleting || isExporting || isImporting,
    isFetching,
    isReady,
    selectedIds,
    setSelectedIds,
    handleDelete,
    handleBatchDelete,
    handlePageChange,
    handleSearch,
    handleStatusChange,
    handlePaymentStatusChange,
    handleTypeChange,
    handleDateChange,
    handleBranchChange,
    handleUserChange,
    handleShiftChange,
    handleExport,
    handleImport,
    refetch,
    resetFilters,
  };
};
