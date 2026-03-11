import { useState } from 'react';
import dayjs from 'dayjs';
import { useGetDashboardOrdersQuery, useGetDashboardDraftOrdersQuery } from '../api/dashboardApi';

import { DEFAULT_PAGE_SIZE } from '@/config/constants';

export const useDashboardOrders = () => {
  const [activeTab, setActiveTab] = useState('new');
  const today = dayjs().format('YYYY-MM-DD');
  
  const [params, setParams] = useState({
    startDate: today,
    endDate: today,
    page: 1,
    page_size: DEFAULT_PAGE_SIZE
  });

  const handleDateChange = (startDate: string, endDate: string) => {
    setParams({ ...params, startDate, endDate, page: 1 });
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setParams(prev => ({ 
      ...prev, 
      page, 
      page_size: pageSize || prev.page_size 
    }));
  };

  const { data: newData, isFetching: isFetchingNew } = useGetDashboardOrdersQuery({
    ...params,
    type: 0
  }, { skip: activeTab !== 'new' });

  const { data: depositData, isFetching: isFetchingDeposit } = useGetDashboardOrdersQuery({
    ...params,
    type: 1
  }, { skip: activeTab !== 'deposit' });

  const { data: draftData, isFetching: isFetchingDraft } = useGetDashboardDraftOrdersQuery({
    ...params,
    type: 0
  }, { skip: activeTab !== 'draft' });

  return {
    activeTab,
    setActiveTab,
    params,
    handleDateChange,
    handlePageChange,
    newOrders: {
      data: newData?.result?.data || [],
      loading: isFetchingNew,
      total: newData?.result?.pagination?.total || 0,
    },
    depositOrders: {
      data: depositData?.result?.data || [],
      loading: isFetchingDeposit,
      total: depositData?.result?.pagination?.total || 0,
    },
    draftOrders: {
      data: draftData?.result?.data || [],
      loading: isFetchingDraft,
      total: draftData?.result?.pagination?.total || 0,
    }
  };
};
