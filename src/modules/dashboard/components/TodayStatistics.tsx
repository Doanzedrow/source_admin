import React from 'react';
import { Card } from 'antd';
import { 
  DollarOutlined, 
  RollbackOutlined, 
  PercentageOutlined, 
  ArrowDownOutlined 
} from '@ant-design/icons';
import { TodayStatisticsSkeleton } from './skeletons';

interface TodayStatisticsProps {
  stats: {
    revenue?: number;
    orders?: number;
    refunds?: number;
    refundCount?: number;
    deposits?: number;
    depositCount?: number;
    netGrowth?: number;
  };
  t: any;
  isLoading?: boolean;
}

export const TodayStatistics: React.FC<TodayStatisticsProps> = ({ stats, t, isLoading = false }) => {
  return (
    <Card className="today-sales-card" title={t('todaySalesResult')} bordered={false}>
      {isLoading ? (
        <TodayStatisticsSkeleton />
      ) : (
        <div className="today-stats-grid">
          <div className="stat-item">
            <div className="item-icon revenue">
              <DollarOutlined />
            </div>
            <div className="item-info">
              <span className="label">{t('revenueLabel')}</span>
              <span className="value">{(stats.revenue || 0).toLocaleString()} đ</span>
              <span className="sub-value">{stats.orders || 0} {t('ordersValue')}</span>
            </div>
          </div>

          <div className="stat-item">
            <div className="item-icon refunds">
              <RollbackOutlined />
            </div>
            <div className="item-info">
              <span className="label">{t('refundsLabel')}</span>
              <span className="value">{(stats.refunds || 0).toLocaleString()} đ</span>
              <span className="sub-value">{stats.refundCount || 0} {t('refundsValue')}</span>
            </div>
          </div>

          <div className="stat-item">
            <div className="item-icon deposit">
              <PercentageOutlined />
            </div>
            <div className="item-info">
              <span className="label">{t('depositLabel')}</span>
              <span className="value">{(stats.deposits || 0).toLocaleString()} đ</span>
              <span className="sub-value">{stats.depositCount || 0} {t('depositValue')}</span>
            </div>
          </div>

          <div className="stat-item">
            <div className="item-icon net-revenue">
              <ArrowDownOutlined />
            </div>
            <div className="item-info">
              <span className="label">{t('netRevenueLabel')}</span>
              <span className="value">{(stats.netGrowth || 0).toFixed(2)} %</span>
              <span className="sub-value">{t('comparedToYesterday')}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
