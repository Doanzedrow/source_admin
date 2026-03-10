import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppCard } from '@/components/common/AppCard';
import { formatRelativeTime, formatCurrency } from '@/utils/format';
import type { RecentActivity } from '../data/dashboard.types';
import { Typography, Flex, Avatar } from 'antd';
import { NotificationOutlined } from '@ant-design/icons';
import { RecentActivitiesSkeleton } from './skeletons';
import { useGetRecentActivitiesQuery } from '../api/dashboardApi';

const { Text } = Typography;

export const RecentActivities: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const { data, isLoading } = useGetRecentActivitiesQuery({ page: 1, limit: 10 });
  const activities = data?.result?.data || [];

  return (
    <AppCard
      title={
        <Flex align="center" gap={8}>
          {t('recentActivities')}
        </Flex>
      }
      className="activity-sidebar"
    >
      {isLoading ? (
        <RecentActivitiesSkeleton />
      ) : (
        <Flex vertical gap={16} className="activity-list">
          {activities.map((item: RecentActivity, index: number) => (
            <Flex key={item._id || index} gap={12} align="flex-start" className="activity-item">
              <Avatar
                size={32}
                icon={<NotificationOutlined style={{ fontSize: 13 }} />}
                className="activity-icon-wrapper"
              />
              <Flex vertical className="activity-content" style={{ flex: 1 }}>
                <span className="description">
                  <strong>{item.implementer?.fullname || t('unknownUser')}</strong> {item.action}{' '}
                  {item.activity} <strong>{item.orderCode}</strong> {item.description}{' '}
                  <strong>{formatCurrency(item.value || 0)}</strong>
                </span>
                <Text type="secondary" className="time">
                  {formatRelativeTime(item.createdAt)}
                </Text>
              </Flex>
            </Flex>
          ))}
        </Flex>
      )}
    </AppCard>
  );
};
