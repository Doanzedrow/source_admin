import React, { useState } from 'react';
import { Card, Typography, Select } from 'antd';
import { DashboardChartSkeleton } from './skeletons';

interface DashboardChartProps {
  t: any;
  revenue?: number;
  isLoading?: boolean;
}

export const DashboardChart: React.FC<DashboardChartProps> = ({ t, revenue = 0, isLoading = false }) => {
  const [activeTab, setActiveTab] = useState('daily');

  return (
    <Card className="revenue-chart-card" bordered={false}>
      {isLoading ? (
        <DashboardChartSkeleton />
      ) : (
        <>
          <div className="chart-header">
            <div className="title-section">
              <Typography.Title level={5} style={{ margin: 0 }}>
                {t('revenueLabel')}
              </Typography.Title>
              <span className="revenue-badge">{revenue.toLocaleString()} đ</span>
            </div>
            <Select defaultValue="today" size="small" style={{ width: 120 }}>
              <Select.Option value="today">{t('filter.today')}</Select.Option>
              <Select.Option value="yesterday">{t('filter.yesterday')}</Select.Option>
              <Select.Option value="thisWeek">{t('filter.thisWeek')}</Select.Option>
            </Select>
          </div>

          <div className="chart-tabs">
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
          </div>

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
    </Card>
  );
};
