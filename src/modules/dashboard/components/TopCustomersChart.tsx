import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Select, Flex } from 'antd';
import dayjs from 'dayjs';
import { AppCard } from '@/components/common/AppCard';
import { formatCurrency } from '@/utils/format';
import { useGetTopCustomersQuery } from '../api/dashboardApi';
import type { TopCustomerParams } from '../data/dashboard.types';

export const TopCustomersChart: React.FC = () => {
  const { t } = useTranslation(['dashboard', 'translation']);
  const today = dayjs().format('YYYY-MM-DD');
  const [params, setParams] = useState<TopCustomerParams>({
    startDate: today,
    endDate: today
  });

  const { data: response, isLoading } = useGetTopCustomersQuery(params);
  const customers = response?.result || [];

  const handleDateChange = (value: string) => {
    let startDate = dayjs().format('YYYY-MM-DD');
    let endDate = dayjs().format('YYYY-MM-DD');

    if (value === 'yesterday') {
      startDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
      endDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    } else if (value === 'thisWeek') {
      startDate = dayjs().startOf('week').format('YYYY-MM-DD');
      endDate = dayjs().endOf('week').format('YYYY-MM-DD');
    }

    setParams({ startDate, endDate });
  };

  // Find max value for bar scaling
  const maxValue = Math.max(...customers.map(c => c.total || 0), 1);

  return (
    <AppCard className="top-customers-card">
      <Flex className="chart-header" justify="space-between" align="center">
        <Typography.Title level={5} style={{ margin: 0 }}>
          {t('topCustomers.title')}
        </Typography.Title>
        <Select 
          defaultValue="today" 
          size="small" 
          style={{ width: 120 }}
          onChange={handleDateChange}
        >
          <Select.Option value="today">{t('filter.today')}</Select.Option>
          <Select.Option value="yesterday">{t('filter.yesterday')}</Select.Option>
          <Select.Option value="thisWeek">{t('filter.thisWeek')}</Select.Option>
        </Select>
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
    </AppCard>
  );
};
