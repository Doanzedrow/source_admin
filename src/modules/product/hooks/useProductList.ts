import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppNotify } from '@/hooks/useAppNotify';
import { 
  useGetProductListQuery, 
  useSwitchStatusMutation
} from '../api/productApi';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';
import type { Product } from '../data/product.types';

export const useProductList = () => {
  const { t } = useTranslation(['product', 'translation']);
  const { notification } = useAppNotify();
  const [params, setParams] = useState({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
  });
  const [switchingId, setSwitchingId] = useState<string | null>(null);

  const { data, isLoading } = useGetProductListQuery(params);
  const [switchStatus] = useSwitchStatusMutation();

  const handlePageChange = (page: number, pageSize?: number) => {
    setParams((prev) => ({
      ...prev,
      page,
      page_size: pageSize || prev.page_size,
    }));
  };

  const handleDelete = (id: string) => {
    console.log('Delete product Id:', id);
  };

  const handleSwitchStatus = async (id: string, currentStatus: number) => {
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
      console.error('Switch status error:', error);
    } finally {
      setSwitchingId(null);
    }
  };

  return {
    data: data?.result?.data || [],
    isLoading,
    switchingId,
    handleDelete,
    handleSwitchStatus,
    params,
    handlePageChange,
    total: data?.result?.pagination?.total || 0,
  };
};
