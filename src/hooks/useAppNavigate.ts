import { useNavigate } from 'react-router-dom';
import { RouteKey, rc } from '@/routes/routeConfig';

export const useAppNavigate = () => {
  const navigate = useNavigate();

  const goToDashboard = () => navigate(rc(RouteKey.Dashboard).path);
  const goToLogin = () => navigate(rc(RouteKey.Login).path);
  const goToProducts = () => navigate(rc(RouteKey.Products).path);
  const goToProductCreate = () => navigate(rc(RouteKey.ProductCreate).path);
  const goToProductEdit = (id: string) => navigate(rc(RouteKey.ProductEdit).path.replace(':id', id));
  
  const goToServiceList = () => navigate(rc(RouteKey.Service).path);
  const goToServiceCreate = () => navigate(rc(RouteKey.ServiceCreate).path);
  const goToServiceEdit = (id: string) => navigate(rc(RouteKey.ServiceEdit).path.replace(':id', id));

  const goToCategories = () => navigate(rc(RouteKey.Category).path);
  const goToCategoryCreate = () => navigate(rc(RouteKey.CategoryCreate).path);
  const goToCategoryEdit = (id: string) => navigate(rc(RouteKey.CategoryEdit).path.replace(':id', id));

  const goToAttributes = () => navigate(rc(RouteKey.Attributes).path);
  const goToAttributeCreate = () => navigate(rc(RouteKey.AttributeCreate).path);
  const goToAttributeEdit = (id: string) => navigate(rc(RouteKey.AttributeEdit).path.replace(':id', id));

  const goToPermissionList = () => navigate(rc(RouteKey.Permission).path);
  const goToPermissionCreate = () => navigate(rc(RouteKey.PermissionCreate).path);
  const goToPermissionEdit = (id: string) => navigate(rc(RouteKey.PermissionEdit).path.replace(':id', id));
  
  const goToRoleList = () => navigate(rc(RouteKey.Role).path);
  const goToRoleCreate = () => navigate(rc(RouteKey.RoleCreate).path);
  const goToRoleEdit = (id: string) => navigate(rc(RouteKey.RoleEdit).path.replace(':id', id));
  
  const goToUserList = () => navigate(rc(RouteKey.Users).path);
  const goToUserCreate = () => navigate(rc(RouteKey.UserCreate).path);
  const goToUserEdit = (id: string) => navigate(rc(RouteKey.UserEdit).path.replace(':id', id));

  const goToShiftList = () => navigate(rc(RouteKey.Shift).path);
  const goToShiftCreate = () => navigate(rc(RouteKey.ShiftCreate).path);
  const goToShiftEdit = (id: string) => navigate(rc(RouteKey.ShiftEdit).path.replace(':id', id));

  const to = (path: string, options?: any) => navigate(path, options);

  return {
    goToDashboard,
    goToLogin,
    goToProducts,
    goToProductCreate,
    goToProductEdit,
    goToServiceList,
    goToServiceCreate,
    goToServiceEdit,
    goToCategories,
    goToCategoryCreate,
    goToCategoryEdit,
    goToAttributes,
    goToAttributeCreate,
    goToAttributeEdit,
    goToPermissionList,
    goToPermissionCreate,
    goToPermissionEdit,
    goToRoleList,
    goToRoleCreate,
    goToRoleEdit,
    goToUserList,
    goToUserCreate,
    goToUserEdit,
    goToShiftList,
    goToShiftCreate,
    goToShiftEdit,
    to,
  };
};
