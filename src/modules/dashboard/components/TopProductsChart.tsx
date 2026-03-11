import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, Flex, Spin, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { AppCard } from '@/components/common/AppCard';
import { formatCurrency } from '@/utils/format';
import { useGetTopProductsQuery } from '../api/dashboardApi';
import type { TopProductParams } from '../data/dashboard.types';
import { DateFilter } from '@/components/common/DateFilter';
import { HorizontalBarChartSkeleton } from './skeletons';

export const TopProductsChart: React.FC = () => {
  const { t } = useTranslation(['dashboard', 'translation']);
  const today = dayjs().format('YYYY-MM-DD');
  const [params, setParams] = useState<TopProductParams>({
    startDate: today,
    endDate: today,
    type: 'revenue',
  });

  const { data: response, isLoading, isFetching } = useGetTopProductsQuery(params);
  const products = response?.result || [];

  const handleDateChange = (startDate: string, endDate: string) => {
    setParams({ ...params, startDate, endDate });
  };

  const handleTypeChange = (value: 'revenue' | 'quantity') => {
    setParams({ ...params, type: value });
  };

  const maxValue = Math.max(...products.map((p) => p.total || 0), 1);

  return (
    <AppCard className="top-products-card" title={t('topProducts.title')}>
      <Spin spinning={isFetching}>
        <Flex gap={12} style={{ marginBottom: 16 }}>
          <Select
            defaultValue="revenue"
            size="small"
            style={{ flex: 1 }}
            onChange={handleTypeChange}
          >
            <Select.Option value="revenue">{t('topProducts.byRevenue')}</Select.Option>
            <Select.Option value="quantity">{t('topProducts.byQuantity')}</Select.Option>
          </Select>
          <DateFilter defaultValue="today" style={{ flex: 1 }} onChange={handleDateChange} />
        </Flex>

        <div className="horizontal-bar-chart">
          {isLoading ? (
            <HorizontalBarChartSkeleton />
          ) : (
            <>
              <div className="grid-lines-vertical">
                {[...Array(5)].map((_, i) => (
                  <div key={i} />
                ))}
              </div>
              <div className="bar-list">
                {products.map((item, index) => {
                  const value = item.total || 0;
                  const width = (value / maxValue) * 100;

                  return (
                    <div key={index} className="bar-item">
                      <div className="bar-label" title={item.label}>
                        {item.label}
                      </div>
                      <div className="bar-container">
                        <Tooltip
                          title={`${item.label}: ${params.type === 'revenue' ? formatCurrency(value) : value}`}
                          placement="topRight"
                        >
                          <div className="bar-fill" style={{ width: `${width}%` }}>
                            <span className="bar-value">
                              {params.type === 'revenue' ? formatCurrency(value) : value}
                            </span>
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="x-axis-labels-horizontal">
                <span>0</span>
                <span>
                  {params.type === 'revenue'
                    ? formatCurrency(maxValue / 2)
                    : (maxValue / 2).toFixed(0)}
                </span>
                <span>{params.type === 'revenue' ? formatCurrency(maxValue) : maxValue}</span>
              </div>
            </>
          )}
        </div>
      </Spin>
    </AppCard>
  );
};
