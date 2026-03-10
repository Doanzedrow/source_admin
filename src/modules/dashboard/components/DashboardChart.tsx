import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, Flex, Spin } from 'antd';
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

  const { data: response, isLoading, isFetching } = useGetChartNetRevenueQuery(params);
  const data = response?.result || { totalNetRevenue: 0, datas: [] };
  const activeTab = params.type;

  const maxValue = Math.max(...data.datas.map(item => item.total || 0), 1);

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
    <AppCard 
      className="revenue-chart-card"
      title={
        <Flex align="center" gap={8}>
          <span>{t('revenueLabel')}</span>
          <span className="revenue-badge" style={{ background: '#e6f7ff', color: '#1890ff', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>
            {formatCurrency(data.totalNetRevenue)}
          </span>
        </Flex>
      }
      extra={
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
      }
    >
      {isLoading ? (
        <DashboardChartSkeleton />
      ) : (
        <Spin spinning={isFetching}>

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

          <div className="chart-container-outer">
            <div className="chart-main-area">
              <div className="grid-lines">
                {[...Array(6)].map((_, i) => <div key={i} />)}
              </div>
              <div className="bars-wrapper">
                {data.datas.map((item, index) => {
                  const height = (item.total / maxValue) * 100;
                  return (
                    <div key={index} className="bar-column-wrapper">
                      <div 
                        className="bar-column" 
                        style={{ height: `${height}%` }}
                        title={`${formatChartLabel(item.label, params.type)}: ${formatCurrency(item.total)}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <Flex className="x-axis-labels" justify="space-around">
              {data.datas.map((item, index) => (
                <div key={index} className="axis-label-item">
                  {formatChartLabel(item.label, params.type)}
                </div>
              ))}
              {data.datas.length === 0 && (
                <div className="axis-label-item">
                  {formatChartLabel(params.startDate, 'day')}
                </div>
              )}
            </Flex>
          </div>
        </Spin>
      )}
    </AppCard>
  );
};
