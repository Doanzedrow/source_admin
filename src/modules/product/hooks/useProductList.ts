import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppNotify } from '@/hooks/useAppNotify';
import { useAppConfirm } from '@/hooks/useAppConfirm';
import {
  useGetProductListQuery,
  useSwitchStatusMutation,
  useDeleteProductMutation,
  useBatchDeleteProductsMutation,
  useBatchUpdateStatusMutation,
} from '../api/productApi';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { useGetAllCategoriesQuery } from '@/modules/category/api/categoryApi';
import { useAppNavigate } from '@/hooks/useAppNavigate';

export const useProductList = () => {
  const { t } = useTranslation(['product', 'translation']);
  const { notification } = useAppNotify();
  const { confirmDelete, confirmBatchDelete } = useAppConfirm();
  const { goToProductCreate, goToProductEdit } = useAppNavigate();

  const { filters, setFilters, resetFilters } = useUrlFilters({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
    keyword: '',
    category: undefined as string | undefined,
    status: undefined as number | undefined,
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [switchingId, setSwitchingId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery({
    type: 1,
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

  const { data, isLoading, isFetching } = useGetProductListQuery(apiParams, {
    skip: !!filters.category && (isCategoriesLoading || !isCategoryReady),
  });

  const [switchStatus] = useSwitchStatusMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [batchDeleteProducts, { isLoading: isBatchDeleting }] = useBatchDeleteProductsMutation();
  const [batchUpdateStatus, { isLoading: isBatchUpdating }] = useBatchUpdateStatusMutation();

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

  const handleDelete = useCallback(
    (id: string) => {
      confirmDelete({
        onOk: async () => {
          try {
            await deleteProduct(id).unwrap();
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
    [confirmDelete, deleteProduct, notification, t]
  );

  const handleBatchDelete = useCallback(
    (ids: string[], onSuccess?: () => void) => {
      if (ids.length === 0) return;

      confirmBatchDelete(ids.length, async () => {
        try {
          await batchDeleteProducts(ids).unwrap();
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
    [confirmBatchDelete, batchDeleteProducts, notification, t]
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
    isLoading: isLoading || isDeleting || isBatchDeleting || isBatchUpdating || isCategoriesLoading,
    isFetching,
    isReady,
    isPending: false,
    switchingId,
    handleDelete,
    handleBatchDelete,
    handleBatchUpdateStatus,
    handleSwitchStatus,
    handlePageChange,
    handleSearch,
    handleCategoryChange,
    handleStatusChange,
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
    goToProductCreate,
    goToProductEdit,
  };
};
