import { useMemo, useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppNotify } from '@/hooks/useAppNotify';
import { useAppConfirm } from '@/hooks/useAppConfirm';
import {
  useGetAttributeListQuery,
  useDeleteAttributeMutation,
  useBatchDeleteAttributesMutation,
  useImportAttributeMutation,
  generateAttributeExportUrl,
} from '../api/attributeApi';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import axiosInstance from '@/utils/axiosInstance';
import { cleanParams } from '@/utils/api';

export const useAttributeList = () => {
  const { t } = useTranslation(['attribute', 'translation']);
  const { notification } = useAppNotify();
  const { confirmDelete, confirmBatchDelete } = useAppConfirm();
  const { goToAttributeCreate, goToAttributeEdit } = useAppNavigate();

  const { filters, setFilters, resetFilters } = useUrlFilters({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
    keyword: '',
    status: undefined as number | undefined,
    branchId: undefined as string | undefined,
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const apiParams = useMemo(() => {
    const params = { ...filters };
    if (params.status !== undefined && params.status !== null) {
      params.status = Number(params.status);
    }
    return params;
  }, [filters]);

  const handleBranchChange = useCallback((val: string) => {
    setFilters({ branchId: val, page: 1 });
  }, [setFilters]);

  const { data, isLoading, isFetching, refetch } = useGetAttributeListQuery(apiParams);
  const [deleteAttribute, { isLoading: isDeleting }] = useDeleteAttributeMutation();
  const [batchDeleteAttributes, { isLoading: isBatchDeleting }] = useBatchDeleteAttributesMutation();
  const [importAttribute, { isLoading: isImporting }] = useImportAttributeMutation();

  const handleExport = useCallback(async () => {
    try {
      setIsExporting(true);
      const url = generateAttributeExportUrl();
      const response = await axiosInstance.post(url, cleanParams(filters), {
        responseType: 'blob',
      }) as any;
      
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `attributes_${new Date().getTime()}.xlsx`);
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
      await importAttribute(file).unwrap();
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
  }, [importAttribute, notification, t, refetch]);

  const rawData = data?.result?.data || [];

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

  const handleDelete = useCallback(
    (id: string) => {
      confirmDelete({
        onOk: async () => {
          try {
            await deleteAttribute(id).unwrap();
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
    [confirmDelete, deleteAttribute, notification, t]
  );

  const handleBatchDelete = useCallback(
    (ids: string[], onSuccess?: () => void) => {
      if (ids.length === 0) return;

      confirmBatchDelete(ids.length, async () => {
        try {
          await batchDeleteAttributes(ids).unwrap();
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
    [confirmBatchDelete, batchDeleteAttributes, notification, t]
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

  return {
    data: rawData,
    refetch,
    isLoading: isLoading || isDeleting || isBatchDeleting || isImporting || isExporting,
    isFetching,
    isReady,
    handleDelete,
    handleBatchDelete,
    params: filters,
    setFilters,
    resetFilters,
    handlePageChange,
    handleSearch,
    handleBranchChange,
    handleExport,
    handleImport,
    total: data?.result?.pagination?.total || 0,
    t,
    rowSelection,
    selectedIds,
    setSelectedIds,
    goToAttributeCreate,
    goToAttributeEdit,
  };
};
