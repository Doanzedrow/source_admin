import { Col, Row } from 'antd';
import { useDashboard } from '../hooks/useDashboard';
import { SEO } from '@/components/common/SEO/SEO';
import { TodayStatistics, RecentActivities, DashboardChart } from '../components';
import '../styles/dashboard.less';

const Dashboard = () => {
  const { 
    t, stats, activities, isStatsLoading, isActivitiesLoading,
    chartData, isChartLoading, setChartParams, chartParams
  } = useDashboard();

  return (
    <div className="dashboard-page">
      <SEO title={t('seoTitle')} description={t('seoDescription')} />
      
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <TodayStatistics stats={stats} t={t} isLoading={isStatsLoading} />
          <DashboardChart 
            t={t} 
            data={chartData} 
            isLoading={isChartLoading} 
            params={chartParams}
            onParamsChange={setChartParams}
          />
        </Col>
        <Col xs={24} lg={8}>
          <RecentActivities activities={activities} t={t} isLoading={isActivitiesLoading} />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
