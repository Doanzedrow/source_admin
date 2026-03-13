import { useMemo, useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  useGetRoleListQuery, 
  useEditRoleMutation, 
  useDeleteRoleMutation 
} from '../api/roleApi';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import { useAppNotify } from '@/hooks/useAppNotify';
import { useAppConfirm } from '@/hooks/useAppConfirm';

export const useRoleList = () => {
  const { t } = useTranslation(['role', 'translation']);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const { data, isLoading, isFetching } = useGetRoleListQuery();
  const [editRole] = useEditRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();
  const { goToRoleCreate, goToRoleEdit } = useAppNavigate();
  const { notification } = useAppNotify();
  const { confirmDelete } = useAppConfirm();

  const roles = useMemo(() => {
    return data?.result || [];
  }, [data]);

  const total = useMemo(() => {
    return roles.length;
  }, [roles]);

  const handleSwitchStatus = async (id: string, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      await editRole({ id, body: { status: newStatus } }).unwrap();
      notification.success({
        title: t('common.messages.success', { ns: 'translation' }),
        description: t('messages.updateStatusSuccess'),
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
          await deleteRole(id).unwrap();
          notification.success({
            title: t('common.messages.success', { ns: 'translation' }),
            description: t('messages.deleteSuccess'),
          });
        } catch (error: any) {
          notification.error({
            title: t('common.messages.error', { ns: 'translation' }),
            description: error?.data?.message || t('common.messages.errorOccurred', { ns: 'translation' }),
          });
        }
      },
    });
  }, [confirmDelete, deleteRole, notification, t]);

  return {
    roles,
    total,
    isLoading,
    isFetching,
    isReady,
    t,
    handleSwitchStatus,
    handleDelete,
    goToRoleCreate,
    goToRoleEdit,
  };
};
