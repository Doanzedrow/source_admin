import { Outlet } from 'react-router-dom';
import './AuthLayout.less';

const AuthLayout = () => {
  return (
    <div className="auth-layout-container">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
