import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { SEO } from '@/components/common/SEO/SEO';
import { 
  TodayStatistics, 
  RecentActivities, 
  DashboardChart,
  TopProductsChart,
  TopCustomersChart
} from '../components';
import '../styles/dashboard.less';

const Dashboard = () => {
  const { t } = useTranslation('dashboard');

  return (
    <div className="dashboard-page">
      <SEO title={t('seoTitle')} description={t('seoDescription')} />
      
      <Row gutter={[24, 24]} align="stretch">
        <Col xs={24} lg={16}>
          <TodayStatistics />
          <DashboardChart />
          
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <TopProductsChart />
            </Col>
            <Col xs={24} lg={12}>
              <TopCustomersChart />
            </Col>
          </Row>
        </Col>
        <Col xs={24} lg={8} style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 12, right: 12, bottom: 0 }}>
            <RecentActivities />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
