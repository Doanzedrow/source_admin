import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Spin } from 'antd';
import dayjs from 'dayjs';
import { AppCard } from '@/components/common/AppCard';
import { DashboardChartSkeleton } from './skeletons';
import { DashboardDateFilter } from './DashboardDateFilter';
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

  const handleFilterChange = (startDate: string, endDate: string) => {
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
        <DashboardDateFilter 
          defaultValue="today" 
          style={{ width: 120 }}
          onChange={handleFilterChange}
        />
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
