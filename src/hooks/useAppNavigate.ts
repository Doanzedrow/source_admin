import { useNavigate } from 'react-router-dom';
import { RouteKey, rc } from '@/routes/routeConfig';

export const useAppNavigate = () => {
  const navigate = useNavigate();

  const goToDashboard = () => navigate(rc(RouteKey.Dashboard).path);
  const goToLogin = () => navigate(rc(RouteKey.Login).path);
  
  const to = (path: string, options?: any) => navigate(path, options);

  return {
    goToDashboard,
    goToLogin,
    to,
  };
};
