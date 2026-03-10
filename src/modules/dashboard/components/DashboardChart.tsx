import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Select, Flex } from 'antd';
import dayjs from 'dayjs';
import { AppCard } from '@/components/common/AppCard';
import { DashboardChartSkeleton } from './skeletons';
import type { NetRevenueParams } from '../data/dashboard.types';
import { formatCurrency, formatChartLabel } from '@/utils/format';
import { useGetChartNetRevenueQuery } from '../api/dashboardApi';

export const DashboardChart: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const today = dayjs().format('YYYY-MM-DD');
  const [params, setParams] = useState<NetRevenueParams>({
    startDate: today,
    endDate: today,
    type: 'day'
  });

  const { data: response, isLoading } = useGetChartNetRevenueQuery(params);
  const data = response?.result || { totalNetRevenue: 0, datas: [] };
  const activeTab = params.type;

  const handleFilterChange = (value: string) => {
    let startDate = dayjs().format('YYYY-MM-DD');
    let endDate = dayjs().format('YYYY-MM-DD');

    if (value === 'yesterday') {
      startDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
      endDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    } else if (value === 'thisWeek') {
      startDate = dayjs().startOf('week').format('YYYY-MM-DD');
      endDate = dayjs().endOf('week').format('YYYY-MM-DD');
    }

    setParams({ ...params, startDate, endDate });
  };

  const handleTypeChange = (type: 'day' | 'hour' | 'weekday') => {
    setParams({ ...params, type });
  };

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
              <span className="revenue-badge">{formatCurrency(data.totalNetRevenue)}</span>
            </Flex>
            <Select 
              defaultValue="today" 
              size="small" 
              style={{ width: 120 }}
              onChange={handleFilterChange}
            >
              <Select.Option value="today">{t('filter.today')}</Select.Option>
              <Select.Option value="yesterday">{t('filter.yesterday')}</Select.Option>
              <Select.Option value="thisWeek">{t('filter.thisWeek')}</Select.Option>
            </Select>
          </Flex>

          <Flex className="chart-tabs" gap={24}>
            <div 
              className={`tab-item ${activeTab === 'day' ? 'active' : ''}`}
              onClick={() => handleTypeChange('day')}
            >
              {t('tabs.byDay')}
            </div>
            <div 
              className={`tab-item ${activeTab === 'hour' ? 'active' : ''}`}
              onClick={() => handleTypeChange('hour')}
            >
              {t('tabs.byHour')}
            </div>
            <div 
              className={`tab-item ${activeTab === 'weekday' ? 'active' : ''}`}
              onClick={() => handleTypeChange('weekday')}
            >
              {t('tabs.byWeekday')}
            </div>
          </Flex>

          <div className="chart-placeholder">
            <div className="grid-lines">
              {[...Array(6)].map((_, i) => <div key={i} />)}
            </div>
            <Flex className="x-axis-labels" justify="space-around" style={{ padding: '8px 0', color: 'var(--text-secondary)', fontSize: 12 }}>
              {data.datas.map((item, index) => (
                <div key={index}>{formatChartLabel(item.label, params.type)}</div>
              ))}
              {data.datas.length === 0 && <div>{formatChartLabel(params.startDate, 'day')}</div>}
            </Flex>
          </div>
        </>
      )}
    </AppCard>
  );
};
