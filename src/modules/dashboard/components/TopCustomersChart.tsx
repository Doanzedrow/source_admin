import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Spin } from 'antd';
import dayjs from 'dayjs';
import { AppCard } from '@/components/common/AppCard';
import { formatCurrency } from '@/utils/format';
import { useGetTopCustomersQuery } from '../api/dashboardApi';
import type { TopCustomerParams } from '../data/dashboard.types';
import { DashboardDateFilter } from './DashboardDateFilter';

export const TopCustomersChart: React.FC = () => {
  const { t } = useTranslation(['dashboard', 'translation']);
  const today = dayjs().format('YYYY-MM-DD');
  const [params, setParams] = useState<TopCustomerParams>({
    startDate: today,
    endDate: today
  });

  const { data: response, isLoading, isFetching } = useGetTopCustomersQuery(params);
  const customers = response?.result || [];

  const handleDateChange = (startDate: string, endDate: string) => {
    setParams({ startDate, endDate });
  };

  // Find max value for bar scaling
  const maxValue = Math.max(...customers.map(c => c.total || 0), 1);

  return (
    <AppCard 
      className="top-customers-card"
      title={t('topCustomers.title')}
    >
      <Spin spinning={isFetching}>
        <Flex justify="flex-end" style={{ marginBottom: 16 }}>
          <DashboardDateFilter 
            defaultValue="today" 
            style={{ width: 120 }}
            onChange={handleDateChange}
          />
        </Flex>

        <div className="horizontal-bar-chart">
          {isLoading ? (
            <div className="chart-loading-placeholder">{t('loading')}</div>
          ) : (
          <>
            <div className="grid-lines-vertical">
              {[...Array(5)].map((_, i) => <div key={i} />)}
            </div>
            <div className="bar-list">
              {customers.map((item, index) => {
                const value = item.total || 0;
                const width = (value / maxValue) * 100;
                
                return (
                  <div key={index} className="bar-item">
                    <div className="bar-label" title={item.label}>{item.label}</div>
                    <div className="bar-container">
                      <div 
                        className="bar-fill" 
                        style={{ width: `${width}%` }}
                      >
                         <span className="bar-value">{formatCurrency(value)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="x-axis-labels-horizontal">
               <span>0</span>
               <span>{formatCurrency(maxValue / 2)}</span>
               <span>{formatCurrency(maxValue)}</span>
            </div>
          </>
        )}
      </div>
    </Spin>
  </AppCard>
  );
};
