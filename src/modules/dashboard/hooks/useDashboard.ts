import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { 
  useGetTodayStatisticsQuery, 
  useGetRecentActivitiesQuery,
  useGetChartNetRevenueQuery 
} from '../api/dashboardApi';
import type { NetRevenueParams } from '../data/dashboard.types';

export const useDashboard = () => {
  const { t } = useTranslation('dashboard');
  const today = dayjs().format('YYYY-MM-DD');

  const [chartParams, setChartParams] = useState<NetRevenueParams>({
    startDate: today,
    endDate: today,
    type: 'day'
  });

  const { 
    data: stats, 
    isLoading: isStatsLoading,
    refetch: refetchStats
  } = useGetTodayStatisticsQuery();

  const { 
    data: activities, 
    isLoading: isActivitiesLoading,
    refetch: refetchActivities
  } = useGetRecentActivitiesQuery({ page: 1, limit: 10 });

  const {
    data: chartData,
    isLoading: isChartLoading,
    refetch: refetchChart
  } = useGetChartNetRevenueQuery(chartParams);

  const handleRefetch = useCallback(() => {
    refetchStats();
    refetchActivities();
    refetchChart();
  }, [refetchStats, refetchActivities, refetchChart]);

  return useMemo(() => ({
    t,
    stats: stats?.result || {},
    activities: activities?.result?.data || [],
    isStatsLoading,
    isActivitiesLoading,
    isChartLoading,
    chartData: chartData?.result || { totalNetRevenue: 0, datas: [] },
    chartParams,
    setChartParams,
    refetch: handleRefetch
  }), [
    t, 
    stats, 
    activities, 
    isStatsLoading, 
    isActivitiesLoading, 
    isChartLoading, 
    chartData, 
    chartParams, 
    handleRefetch
  ]);
};
