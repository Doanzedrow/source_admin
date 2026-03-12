import { useAppSelector } from '@/store/hooks';
import { selectLoggedUser } from '@/modules/auth/slice/authSlice';
import type { PermissionAction } from '@/types';

export const usePermission = () => {
  const user = useAppSelector(selectLoggedUser);

  /**
   * Check if user has a specific permission on a module
   */
  const can = (module: string, action: keyof PermissionAction): boolean => {
    // 1. Super Admin always has all permissions
    if (user?.isSuperAdmin) return true;

    // 2. If no user or no role, no permission
    if (!user || !user.role || !user.role.permissions) return false;

    // 3. Find the permission for the specific module
    const modulePermission = user.role.permissions.find(
      (p) => p.module === module && p.status === 1
    );

    if (!modulePermission) return false;

    // 4. Check the specific action
    return !!modulePermission.actions[action];
  };

  /**
   * Check if user is Super Admin
   */
  const isSuperAdmin = !!user?.isSuperAdmin;

  /**
   * Check if user has ANY access to a module (view permission)
   */
  const hasModule = (module: string): boolean => {
    return can(module, 'view');
  };

  return {
    can,
    hasModule,
    isSuperAdmin,
    user,
  };
};
