import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', backgroundColor: 'var(--bg-color)' }}>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
