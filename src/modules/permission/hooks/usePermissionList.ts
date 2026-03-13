import { useMemo, useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  useGetPermissionListQuery, 
  useEditPermissionMutation,
  useDeletePermissionMutation 
} from '../api/permissionApi';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import { useAppNotify } from '@/hooks/useAppNotify';
import { useAppConfirm } from '@/hooks/useAppConfirm';

export const usePermissionList = () => {
  const { t } = useTranslation(['permission', 'translation']);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const { data, isLoading, isFetching } = useGetPermissionListQuery();
  const [editPermission] = useEditPermissionMutation();
  const [deletePermission] = useDeletePermissionMutation();
  const { goToPermissionCreate, goToPermissionEdit } = useAppNavigate();
  const { notification } = useAppNotify();
  const { confirmDelete } = useAppConfirm();

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
      notification.success({
        title: t('common.messages.success', { ns: 'translation' }),
        description: t('messages.updateStatusSuccess', { ns: 'permission', defaultValue: 'Cập nhật trạng thái thành công' }),
      });
    } catch (error: any) {
      notification.error({
        title: t('common.messages.error', { ns: 'translation' }),
        description: error?.data?.message || t('common.messages.errorOccurred', { ns: 'translation' }),
      });
    }
  };

  const handleDelete = useCallback((id: string) => {
    confirmDelete({
      onOk: async () => {
        try {
          await deletePermission(id).unwrap();
          notification.success({
            title: t('common.messages.success', { ns: 'translation' }),
            description: t('messages.deleteSuccess', { ns: 'permission', defaultValue: 'Xóa quyền thành công' }),
          });
        } catch (error: any) {
          notification.error({
            title: t('common.messages.error', { ns: 'translation' }),
            description: error?.data?.message || t('common.messages.errorOccurred', { ns: 'translation' }),
          });
        }
      },
    });
  }, [confirmDelete, deletePermission, notification, t]);

  return {
    permissions,
    total,
    isLoading,
    isFetching,
    isReady,
    t,
    handleSwitchStatus,
    handleDelete,
    goToPermissionCreate,
    goToPermissionEdit,
  };
};
