import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppCard } from '@/components/common/AppCard';
import { formatCurrency } from '@/utils/format';
import { 
  DollarOutlined, 
  RollbackOutlined, 
  PercentageOutlined, 
  ArrowDownOutlined,
  ArrowUpOutlined,
  MinusOutlined
} from '@ant-design/icons';
import { TodayStatisticsSkeleton } from './skeletons';
import { useGetTodayStatisticsQuery } from '../api/dashboardApi';

export const TodayStatistics: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const { data, isLoading } = useGetTodayStatisticsQuery();
  const stats = data?.result || {};

  return (
    <AppCard className="today-sales-card" title={t('todaySalesResult')}>
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
              <span className="value">{formatCurrency(stats.totalSaleRevenue || 0)}</span>
              <span className="sub-value">{stats.totalSaleOrders || 0} {t('ordersValue')}</span>
            </div>
          </div>

          <div className="stat-item">
            <div className="item-icon refunds">
              <RollbackOutlined />
            </div>
            <div className="item-info">
              <span className="label">{t('refundsLabel')}</span>
              <span className="value">{formatCurrency(stats.totalReturnRevenue || 0)}</span>
              <span className="sub-value">{stats.totalReturnOrders || 0} {t('refundsValue')}</span>
            </div>
          </div>

          <div className="stat-item">
            <div className="item-icon deposit">
              <PercentageOutlined />
            </div>
            <div className="item-info">
              <span className="label">{t('depositLabel')}</span>
              <span className="value">{formatCurrency(stats.totalDepositRevenue || 0)}</span>
              <span className="sub-value">{stats.totalDepositOrders || 0} {t('depositValue')}</span>
            </div>
          </div>

          <div className="stat-item">
            <div className={`item-icon ${!stats.percentChangeYesterday ? 'neutral' : (stats.percentChangeYesterday > 0 ? 'trend-up' : 'trend-down')}`}>
              {!stats.percentChangeYesterday ? <MinusOutlined /> : (stats.percentChangeYesterday > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />)}
            </div>
            <div className="item-info">
              <span className="label">{t('netRevenueLabel')}</span>
              <span className="value">{(stats.percentChangeYesterday || 0).toFixed(2)} %</span>
              <span className="sub-value">{t('comparedToYesterday')}</span>
            </div>
          </div>
        </div>
      )}
    </AppCard>
  );
};
