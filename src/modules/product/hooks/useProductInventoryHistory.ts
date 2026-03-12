import { useMemo } from 'react';
import { useGetInventoryHistoriesQuery } from '../api/productApi';
import { useTranslation } from 'react-i18next';
import { useStaggeredRender } from '@/hooks/useStaggeredRender';

export const useProductInventoryHistory = (productId: string) => {
  const { t } = useTranslation(['product', 'translation']);

  const { data, isLoading, isFetching } = useGetInventoryHistoriesQuery(productId, {
    skip: !productId,
    pollingInterval: 0,
    refetchOnFocus: false,
  });

  const renderStep = useStaggeredRender([100, 300]);

  const historyData = useMemo(() => {
    if (!data) return [];
    return data;
  }, [data]);

  const isEmpty = !isLoading && (!historyData || historyData.length === 0);

  return {
    t,
    data: historyData,
    rawCount: historyData.length,
    isLoading: isLoading && renderStep < 2,
    isReady: renderStep >= 3 && !isLoading,
    isFetching,
    isEmpty,
  };
};
