import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppNotify } from '@/hooks/useAppNotify';
import { useAppConfirm } from '@/hooks/useAppConfirm';
import {
  useGetServiceListQuery,
  useSwitchServiceStatusMutation,
  useDeleteServiceMutation,
  useBatchDeleteServicesMutation,
  useBatchUpdateServiceStatusMutation,
  generateServiceExportUrl,
  useImportServiceMutation,
} from '../api/serviceApi';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { useGetAllCategoriesQuery } from '@/modules/category/api/categoryApi';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import axiosInstance from '@/utils/axiosInstance';
import { cleanParams } from '@/utils/api';

export const useServiceList = () => {
  const { t } = useTranslation(['service', 'translation']);
  const { notification } = useAppNotify();
  const { confirmDelete, confirmBatchDelete } = useAppConfirm();
  const { goToServiceCreate, goToServiceEdit } = useAppNavigate();

  const { filters, setFilters, resetFilters } = useUrlFilters({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
    keyword: '',
    category: undefined as string | undefined,
    status: undefined as number | undefined,
    branchId: undefined as string | undefined,
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [switchingId, setSwitchingId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery({
    type: 2,
  });
  const categories = useMemo(() => categoriesData?.result || [], [categoriesData]);

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.code, c._id));
    return map;
  }, [categories]);

  const apiParams = useMemo(() => {
    const params = { ...filters };

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

  const isCategoryReady =
    !filters.category || (filters.category && categories.some((c) => c.code === filters.category));

  const { data, isLoading, isFetching, refetch } = useGetServiceListQuery(apiParams, {
    skip: !!filters.category && (isCategoriesLoading || !isCategoryReady),
  });

  const [switchStatus] = useSwitchServiceStatusMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();
  const [batchDeleteServices, { isLoading: isBatchDeleting }] = useBatchDeleteServicesMutation();
  const [batchUpdateStatus, { isLoading: isBatchUpdating }] = useBatchUpdateServiceStatusMutation();
  const [importService, { isLoading: isImporting }] = useImportServiceMutation();

  const handleExport = useCallback(async () => {
    try {
      setIsExporting(true);
      const url = generateServiceExportUrl();
      const response = await axiosInstance.post(url, cleanParams({ ...apiParams, type: 2 }), {
        responseType: 'blob',
      }) as any;
      
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `services_${new Date().getTime()}.xlsx`);
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

  const handleImport = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      await importService(formData).unwrap();
      notification.success({
        title: t('common.messages.success', { ns: 'translation' }),
        description: t('messages.importSuccess', { defaultValue: 'Nhập dữ liệu thành công' }),
      });
      refetch();
    } catch (error: any) {
      notification.error({
        title: t('common.messages.error', { ns: 'translation' }),
        description: error?.data?.message || t('messages.importError', { defaultValue: 'Nhập dữ liệu thất bại' }),
      });
    }
  }, [importService, notification, t, refetch]);

  const handlePageChange = useCallback(
    (page: number, pageSize?: number) => {
      setFilters({
        page,
        page_size: pageSize || filters.page_size,
      });
    },
    [filters.page_size, setFilters]
  );

  const handleSearch = useCallback(
    (val: string) => {
      setFilters({ keyword: val, page: 1 });
    },
    [setFilters]
  );

  const handleCategoryChange = useCallback(
    (val: string) => {
      setFilters({ category: val, page: 1 });
    },
    [setFilters]
  );

  const handleStatusChange = useCallback(
    (val: any) => {
      setFilters({ status: val, page: 1 });
    },
    [setFilters]
  );
  
  const handleBranchChange = useCallback(
    (val: string) => {
      setFilters({ branchId: val, page: 1 });
    },
    [setFilters]
  );
  
  const handleDelete = useCallback(
    (id: string) => {
      confirmDelete({
        onOk: async () => {
          try {
            await deleteService(id).unwrap();
            notification.success({
              title: t('common.messages.success', { ns: 'translation' }),
              description: t('messages.deleteSuccess'),
            });
          } catch (error: any) {
            notification.error({
              title: t('messages.deleteError'),
              description: error?.data?.message || error?.message,
            });
          }
        },
      });
    },
    [confirmDelete, deleteService, notification, t]
  );

  const handleBatchDelete = useCallback(
    (ids: string[], onSuccess?: () => void) => {
      if (ids.length === 0) return;

      confirmBatchDelete(ids.length, async () => {
        try {
          await batchDeleteServices(ids).unwrap();
          notification.success({
            title: t('common.messages.success', { ns: 'translation' }),
            description: t('messages.deleteSuccess'),
          });
          onSuccess?.();
        } catch (error: any) {
          notification.error({
            title: t('messages.deleteError'),
            description: error?.data?.message || error?.message,
          });
        }
      });
    },
    [confirmBatchDelete, batchDeleteServices, notification, t]
  );

  const handleSwitchStatus = useCallback(
    async (id: string, currentStatus: number) => {
      try {
        setSwitchingId(id);
        const newStatus = currentStatus === 1 ? 0 : 1;
        await switchStatus({ id, status: newStatus }).unwrap();
        notification.success({
          title: t('common.messages.success', { ns: 'translation' }),
          description: t('messages.updateStatusSuccess'),
        });
      } catch (error: any) {
        notification.error({
          title: t('messages.updateStatusError'),
          description: error?.data?.message || error?.message,
        });
      } finally {
        setSwitchingId(null);
      }
    },
    [switchStatus, notification, t]
  );

  const handleBatchUpdateStatus = useCallback(
    async (ids: string[], status: number, onSuccess?: () => void) => {
      if (ids.length === 0) return;
      try {
        await batchUpdateStatus({ productIds: ids, status }).unwrap();
        notification.success({
          title: t('common.messages.success', { ns: 'translation' }),
          description: t('messages.updateStatusSuccess'),
        });
        onSuccess?.();
      } catch (error: any) {
        notification.error({
          title: t('messages.updateStatusError'),
          description: error?.data?.message || error?.message,
        });
      }
    },
    [batchUpdateStatus, notification, t]
  );

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ label: c.name, value: c.code })),
    [categories]
  );

  const statusOptions = useMemo(
    () => [
      { label: t('status.active'), value: 1 },
      { label: t('status.inactive'), value: 0 },
    ],
    [t]
  );

  const rowSelection = useMemo(
    () => ({
      type: 'checkbox' as const,
      selectedRowKeys: selectedIds,
      onChange: (keys: React.Key[]) => setSelectedIds(keys as string[]),
      preserveSelectedRowKeys: true,
    }),
    [selectedIds]
  );

  const rawData = data?.result?.data || [];

  return {
    data: rawData,
    refetch,
    isLoading: isLoading || isDeleting || isBatchDeleting || isBatchUpdating || isCategoriesLoading || isImporting || isExporting,
    isFetching,
    isReady,
    isPending: isCategoriesLoading,
    switchingId,
    handleDelete,
    handleBatchDelete,
    handleBatchUpdateStatus,
    handleSwitchStatus,
    handlePageChange,
    handleSearch,
    handleCategoryChange,
    handleStatusChange,
    handleBranchChange,
    handleExport,
    handleImport,
    params: filters,
    setFilters,
    resetFilters,
    categories,
    total: data?.result?.pagination?.total || 0,
    t,
    rowSelection,
    selectedIds,
    setSelectedIds,
    categoryOptions,
    statusOptions,
    localCategory: filters.category,
    localStatus: filters.status,
    localBranchId: filters.branchId,
    goToServiceCreate,
    goToServiceEdit,
  };
};
