import { useNavigate } from 'react-router-dom';
import { RouteKey, rc } from '@/routes/routeConfig';

export const useAppNavigate = () => {
  const navigate = useNavigate();

  const goToDashboard = () => navigate(rc(RouteKey.Dashboard).path);
  const goToLogin = () => navigate(rc(RouteKey.Login).path);
  const goToProducts = () => navigate(rc(RouteKey.Products).path);
  const goToProductCreate = () => navigate(rc(RouteKey.ProductCreate).path);
  const goToProductEdit = (id: string) => navigate(rc(RouteKey.ProductEdit).path.replace(':id', id));
  
  const goToCategories = () => navigate(rc(RouteKey.Category).path);
  const goToCategoryCreate = () => navigate(rc(RouteKey.CategoryCreate).path);
  const goToCategoryEdit = (id: string) => navigate(rc(RouteKey.CategoryEdit).path.replace(':id', id));

  const goToAttributes = () => navigate(rc(RouteKey.Attributes).path);
  const goToAttributeCreate = () => navigate(rc(RouteKey.AttributeCreate).path);
  const goToAttributeEdit = (id: string) => navigate(rc(RouteKey.AttributeEdit).path.replace(':id', id));

  const to = (path: string, options?: any) => navigate(path, options);

  return {
    goToDashboard,
    goToLogin,
    goToProducts,
    goToProductCreate,
    goToProductEdit,
    goToCategories,
    goToCategoryCreate,
    goToCategoryEdit,
    goToAttributes,
    goToAttributeCreate,
    goToAttributeEdit,
    to,
  };
};
