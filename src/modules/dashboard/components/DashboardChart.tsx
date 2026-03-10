import React, { useState } from 'react';
import type { TFunction } from 'i18next';
import { Typography, Select, Flex } from 'antd';
import { AppCard } from '@/components/common/AppCard';
import { DashboardChartSkeleton } from './skeletons';

interface DashboardChartProps {
  t: TFunction;
  revenue?: number;
  isLoading?: boolean;
}

export const DashboardChart: React.FC<DashboardChartProps> = ({ t, revenue = 0, isLoading = false }) => {
  const [activeTab, setActiveTab] = useState('daily');

  return (
    <AppCard className="revenue-chart-card">
      {isLoading ? (
        <DashboardChartSkeleton />
      ) : (
        <>
          <Flex className="chart-header" justify="space-between" align="center">
            <Flex className="title-section" align="center" gap={8}>
              <Typography.Title level={5} style={{ margin: 0 }}>
                {t('revenueLabel')}
              </Typography.Title>
              <span className="revenue-badge">{revenue.toLocaleString()} đ</span>
            </Flex>
            <Select defaultValue="today" size="small" style={{ width: 120 }}>
              <Select.Option value="today">{t('filter.today')}</Select.Option>
              <Select.Option value="yesterday">{t('filter.yesterday')}</Select.Option>
              <Select.Option value="thisWeek">{t('filter.thisWeek')}</Select.Option>
            </Select>
          </Flex>

          <Flex className="chart-tabs" gap={24}>
            <div 
              className={`tab-item ${activeTab === 'daily' ? 'active' : ''}`}
              onClick={() => setActiveTab('daily')}
            >
              {t('tabs.byDay')}
            </div>
            <div 
              className={`tab-item ${activeTab === 'hourly' ? 'active' : ''}`}
              onClick={() => setActiveTab('hourly')}
            >
              {t('tabs.byHour')}
            </div>
            <div 
              className={`tab-item ${activeTab === 'weekday' ? 'active' : ''}`}
              onClick={() => setActiveTab('weekday')}
            >
              {t('tabs.byWeekday')}
            </div>
          </Flex>

          <div className="chart-placeholder">
            <div className="grid-lines">
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
            </div>
            <div className="x-axis">
              {new Date().toLocaleDateString('vi-VN')}
            </div>
          </div>
        </>
      )}
    </AppCard>
  );
};
