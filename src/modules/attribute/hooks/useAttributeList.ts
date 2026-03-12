import { useMemo, useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppNotify } from '@/hooks/useAppNotify';
import { useAppConfirm } from '@/hooks/useAppConfirm';
import {
  useGetAttributeListQuery,
  useDeleteAttributeMutation,
  useBatchDeleteAttributesMutation,
} from '../api/attributeApi';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { useAppNavigate } from '@/hooks/useAppNavigate';

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
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

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

  const { data, isLoading, isFetching, refetch } = useGetAttributeListQuery(apiParams);
  const [deleteAttribute, { isLoading: isDeleting }] = useDeleteAttributeMutation();
  const [batchDeleteAttributes, { isLoading: isBatchDeleting }] = useBatchDeleteAttributesMutation();

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
    isLoading: isLoading || isDeleting || isBatchDeleting,
    isFetching,
    isReady,
    handleDelete,
    handleBatchDelete,
    params: filters,
    setFilters,
    resetFilters,
    handlePageChange,
    handleSearch,
    total: data?.result?.pagination?.total || 0,
    t,
    rowSelection,
    selectedIds,
    setSelectedIds,
    goToAttributeCreate,
    goToAttributeEdit,
  };
};
