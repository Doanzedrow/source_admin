import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Select, Flex, Spin } from 'antd';
import dayjs from 'dayjs';
import { AppCard } from '@/components/common/AppCard';
import { formatCurrency } from '@/utils/format';
import { useGetTopProductsQuery } from '../api/dashboardApi';
import type { TopProductParams } from '../data/dashboard.types';

export const TopProductsChart: React.FC = () => {
  const { t } = useTranslation(['dashboard', 'translation']);
  const today = dayjs().format('YYYY-MM-DD');
  const [params, setParams] = useState<TopProductParams>({
    startDate: today,
    endDate: today,
    type: 'revenue'
  });

  const { data: response, isLoading, isFetching } = useGetTopProductsQuery(params);
  const products = response?.result || [];

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

    setParams({ ...params, startDate, endDate });
  };

  const handleTypeChange = (value: 'revenue' | 'quantity') => {
    setParams({ ...params, type: value });
  };

  // Find max value for bar scaling
  const maxValue = Math.max(...products.map(p => p.total || 0), 1);

  return (
    <AppCard className="top-products-card">
      <Spin spinning={isFetching}>
        <Flex className="chart-header" justify="space-between" align="center">
          <Typography.Title level={5} style={{ margin: 0 }}>
            {t('topProducts.title')}
          </Typography.Title>
          <Flex gap={8}>
            <Select 
              defaultValue="revenue" 
              size="small" 
              style={{ width: 140 }}
              onChange={handleTypeChange}
            >
              <Select.Option value="revenue">{t('topProducts.byRevenue')}</Select.Option>
              <Select.Option value="quantity">{t('topProducts.byQuantity')}</Select.Option>
            </Select>
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
              {products.map((item, index) => {
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
                         <span className="bar-value">
                           {params.type === 'revenue' ? formatCurrency(value) : value}
                         </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="x-axis-labels-horizontal">
               <span>0</span>
               <span>{params.type === 'revenue' ? formatCurrency(maxValue / 2) : (maxValue / 2).toFixed(0)}</span>
               <span>{params.type === 'revenue' ? formatCurrency(maxValue) : maxValue}</span>
            </div>
          </>
        )}
      </div>
    </Spin>
  </AppCard>
  );
};
