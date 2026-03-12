import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetPermissionListQuery } from '../api/permissionApi';
import { useAppNavigate } from '@/hooks/useAppNavigate';

export const usePermissionList = () => {
  const { t } = useTranslation(['permission', 'translation']);
  const { data, isLoading, isFetching, refetch } = useGetPermissionListQuery();
  const { goToPermissionCreate, goToPermissionEdit } = useAppNavigate();

  const permissions = useMemo(() => {
    return data?.result || [];
  }, [data]);

  const total = useMemo(() => {
    return permissions.length;
  }, [permissions]);

  return {
    permissions,
    total,
    isLoading,
    isFetching,
    refetch,
    t,
    goToPermissionCreate,
    goToPermissionEdit,
  };
};
