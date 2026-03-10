import { Col, Row } from 'antd';
import { useDashboard } from '../hooks/useDashboard';
import { SEO } from '@/components/common/SEO/SEO';
import { AppLoader } from '@/components/common/AppLoader/AppLoader';
import { TodayStatistics, RecentActivities, DashboardChart } from '../components';
import '../styles/dashboard.less';

const Dashboard = () => {
  const { t, stats, activities, isLoading } = useDashboard();

  if (isLoading) {
    return <AppLoader />;
  }

  return (
    <div className="dashboard-page">
      <SEO title={t('seoTitle')} description={t('seoDescription')} />
      
      <Row gutter={[24, 24]}>
        {/* Cột 1: Thông tin Dashboard & Biểu đồ */}
        <Col xs={24} lg={16}>
          <TodayStatistics stats={stats} t={t} />
          <DashboardChart t={t} revenue={stats.revenue} />
        </Col>

        {/* Cột 2: Hoạt động gần đây */}
        <Col xs={24} lg={8}>
          <RecentActivities activities={activities} t={t} />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
