import { useState, useCallback, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppNotify } from '@/hooks/useAppNotify';
import { useAppConfirm } from '@/hooks/useAppConfirm';
import { 
  useGetCategoryListQuery, 
  useSwitchCategoryStatusMutation,
  useDeleteCategoryMutation,
  useBatchDeleteCategoriesMutation,
  useImportCategoryMutation,
  generateCategoryExportUrl
} from '../api/categoryApi';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import axiosInstance from '@/utils/axiosInstance';
import { cleanParams } from '@/utils/api';

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
    branchId: undefined as string | undefined,
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [switchingId, setSwitchingId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const { data, isLoading, isFetching, refetch } = useGetCategoryListQuery(filters);
  const [switchStatus] = useSwitchCategoryStatusMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [batchDeleteCategories, { isLoading: isBatchDeleting }] = useBatchDeleteCategoriesMutation();
  const [importCategory, { isLoading: isImporting }] = useImportCategoryMutation();

  const handlePageChange = useCallback((page: number, pageSize?: number) => {
    setFilters({
      page,
      page_size: pageSize || filters.page_size,
    });
  }, [filters.page_size, setFilters]);

  const handleSearch = useCallback((val: string) => {
    setFilters({ keyword: val, page: 1 });
  }, [setFilters]);

  const handleBranchChange = useCallback((val: string) => {
    setFilters({ branchId: val, page: 1 });
  }, [setFilters]);

  const handleExport = useCallback(async () => {
    try {
      setIsExporting(true);
      const url = generateCategoryExportUrl();
      const response = await axiosInstance.post(url, cleanParams(filters), {
        responseType: 'blob',
      }) as any;
      
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `categories_${new Date().getTime()}.xlsx`);
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
  }, [filters, notification, t]);

  const handleImport = useCallback(async (file: File) => {
    try {
      await importCategory(file).unwrap();
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
  }, [importCategory, notification, t, refetch]);

  const handleSwitchStatus = useCallback(async (id: string, currentStatus: number) => {
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
  }, [switchStatus, notification, t]);

  const handleDelete = useCallback((id: string) => {
    confirmDelete({
      onOk: async () => {
        try {
          await deleteCategory(id).unwrap();
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
  }, [confirmDelete, deleteCategory, notification, t]);

  const handleBatchDelete = useCallback((ids: string[], onSuccess?: () => void) => {
    if (ids.length === 0) return;

    confirmBatchDelete(ids.length, async () => {
      try {
        await batchDeleteCategories(ids).unwrap();
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
  }, [confirmBatchDelete, batchDeleteCategories, notification, t]);

  const rowSelection = useMemo(() => ({
    type: 'checkbox' as const,
    selectedRowKeys: selectedIds,
    onChange: (keys: React.Key[]) => setSelectedIds(keys as string[]),
    preserveSelectedRowKeys: true,
  }), [selectedIds]);

  const rawData = data?.result?.data || [];

  return {
    data: rawData,
    refetch,
    isLoading: isLoading || isDeleting || isBatchDeleting || isImporting || isExporting,
    isFetching,
    isReady,
    switchingId,
    handleDelete,
    handleBatchDelete,
    handleSwitchStatus,
    handleSearch,
    handleBranchChange,
    handleExport,
    handleImport,
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
