import { useDashboard } from '../hooks/useDashboard';
import '../styles/dashboard.less';

const Dashboard = () => {
  const { t, data } = useDashboard();

  return (
    <div className="dashboard-container">
      <h1>{t('title')}</h1>
      <ul className="dashboard-stats-list">
        <li className="dashboard-stat-item">
          <h3>{t('revenue', { amount: data.revenue })}</h3>
        </li>
        <li className="dashboard-stat-item">
          <h3>{t('newOrders', { count: data.orders })}</h3>
        </li>
      </ul>
    </div>
  );
};

export default Dashboard;
