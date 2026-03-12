import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetPermissionListQuery, useEditPermissionMutation } from '../api/permissionApi';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import { useAppNotify } from '@/hooks/useAppNotify';

export const usePermissionList = () => {
  const { t } = useTranslation(['permission', 'translation']);
  const { data, isLoading, isFetching } = useGetPermissionListQuery();
  const [editPermission] = useEditPermissionMutation();
  const { goToPermissionCreate, goToPermissionEdit } = useAppNavigate();
  const { message } = useAppNotify();

  const permissions = useMemo(() => {
    return data?.result || [];
  }, [data]);

  const total = useMemo(() => {
    return permissions.length;
  }, [permissions]);

  const handleSwitchStatus = async (id: string, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      await editPermission({ id, body: { status: newStatus } }).unwrap();
      message.success(t('messages.updateStatusSuccess', { ns: 'permission', defaultValue: 'Cập nhật trạng thái thành công' }));
    } catch (error: any) {
      message.error(error?.data?.message || t('common.messages.errorOccurred', { ns: 'translation' }));
    }
  };

  return {
    permissions,
    total,
    isLoading,
    isFetching,
    t,
    handleSwitchStatus,
    goToPermissionCreate,
    goToPermissionEdit,
  };
};
