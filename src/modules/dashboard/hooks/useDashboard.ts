import { useTranslation } from 'react-i18next';
import { useGetTodayStatisticsQuery, useGetRecentActivitiesQuery } from '../api/dashboardApi';

export const useDashboard = () => {
  const { t } = useTranslation('dashboard');

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

  return {
    t,
    stats: stats?.result || {},
    activities: activities?.result?.data || [],
    isLoading: isStatsLoading || isActivitiesLoading,
    refetch: () => {
      refetchStats();
      refetchActivities();
    }
  };
};
