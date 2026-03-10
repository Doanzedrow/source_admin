import { Card, Col, Row, Statistic } from 'antd';
import { ArrowUpOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useDashboard } from '../hooks/useDashboard';
import '../styles/dashboard.less';

const Dashboard = () => {
  const { t, data } = useDashboard();

  return (
    <div className="dashboard-container">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="stat-card">
            <Statistic
              title={t('revenueLabel')}
              value={data.revenue.replace(/[^0-9]/g, '')}
              prefix={<ArrowUpOutlined />}
              suffix="VNĐ"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="stat-card">
            <Statistic
              title={t('newOrdersLabel')}
              value={data.orders}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
