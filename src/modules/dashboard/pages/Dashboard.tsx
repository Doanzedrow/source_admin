import React, { Suspense } from 'react';
import { Col, Row, Flex, Skeleton } from 'antd';
import { useTranslation } from 'react-i18next';
import { SEO } from '@/components/common/SEO/SEO';
import { AppCard } from '@/components/common/AppCard';
import { TodayStatistics } from '../components';
import { 
  DashboardChartSkeleton, 
  HorizontalBarChartSkeleton, 
  RecentActivitiesSkeleton 
} from '../components/skeletons';
import { useStaggeredRender } from '@/hooks/useStaggeredRender';
import { LazyInView } from '@/components/common/LazyInView';
import '../styles/dashboard.less';

const DashboardChartLazy = React.lazy(() => import('../components').then(m => ({ default: m.DashboardChart })));
const TopProductsChartLazy = React.lazy(() => import('../components').then(m => ({ default: m.TopProductsChart })));
const TopCustomersChartLazy = React.lazy(() => import('../components').then(m => ({ default: m.TopCustomersChart })));
const RecentActivitiesLazy = React.lazy(() => import('../components').then(m => ({ default: m.RecentActivities })));
const DashboardOrdersLazy = React.lazy(() => import('../components').then(m => ({ default: m.DashboardOrders })));

const MainChartFallback = () => (
  <AppCard className="revenue-chart-card">
    <DashboardChartSkeleton />
  </AppCard>
);

const ProductsChartFallback = () => (
  <AppCard className="top-products-card" title={<Skeleton.Input active size="small" style={{ width: 140 }} />}>
    <HorizontalBarChartSkeleton />
  </AppCard>
);

const CustomersChartFallback = () => (
  <AppCard className="top-customers-card" title={<Skeleton.Input active size="small" style={{ width: 140 }} />}>
    <HorizontalBarChartSkeleton />
  </AppCard>
);

const ActivitiesFallback = () => (
  <AppCard className="activity-sidebar" title={<Skeleton.Input active size="small" style={{ width: 140 }} />} style={{ height: '100%', margin: 0 }}>
    <RecentActivitiesSkeleton />
  </AppCard>
);

const OrdersFallback = () => (
  <AppCard className="dashboard-orders-card" title={<Skeleton.Input active size="small" style={{ width: 150 }} />} style={{ marginTop: 24 }}>
    <Skeleton active paragraph={{ rows: 6 }} />
  </AppCard>
);

const Dashboard = () => {
  const { t } = useTranslation('dashboard');
  
  const loadStep = useStaggeredRender([150, 550, 750]);
  const isMainChartReady = loadStep >= 2;
  const isSecondaryReady = loadStep >= 3;
  const isOrdersReady = loadStep >= 4;

  return (
    <div className="dashboard-page">
      <SEO title={t('seoTitle')} description={t('seoDescription')} />
      
      <Row gutter={[24, 24]} align="stretch">
        <Col xs={24} lg={16}>
          <Flex vertical gap={24}>
            <TodayStatistics />
            
            {isMainChartReady ? (
              <Suspense fallback={<MainChartFallback />}>
                <DashboardChartLazy />
              </Suspense>
            ) : <MainChartFallback />}
            
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                {isSecondaryReady && (
                  <LazyInView minHeight={400} rootMargin="50px 0px">
                    <Suspense fallback={<ProductsChartFallback />}>
                      <TopProductsChartLazy />
                    </Suspense>
                  </LazyInView>
                )}
              </Col>
              <Col xs={24} lg={12}>
                {isSecondaryReady && (
                  <LazyInView minHeight={400} rootMargin="50px 0px">
                    <Suspense fallback={<CustomersChartFallback />}>
                      <TopCustomersChartLazy />
                    </Suspense>
                  </LazyInView>
                )}
              </Col>
            </Row>
          </Flex>
        </Col>
        
        <Col xs={24} lg={8} className="recent-activities-col">
          <div className="recent-activities-wrapper">
            {isMainChartReady && (
              <Suspense fallback={<ActivitiesFallback />}>
                <RecentActivitiesLazy />
              </Suspense>
            )}
          </div>
        </Col>
      </Row>

      {isOrdersReady && (
        <LazyInView minHeight={400} rootMargin="100px 0px">
          <Suspense fallback={<OrdersFallback />}>
            <DashboardOrdersLazy />
          </Suspense>
        </LazyInView>
      )}
    </div>
  );
};

export default Dashboard;
