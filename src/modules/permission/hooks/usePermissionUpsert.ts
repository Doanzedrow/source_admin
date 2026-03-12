import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppNotify } from '@/hooks/useAppNotify';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import {
  useGetPermissionByIdQuery,
  useAddPermissionMutation,
  useEditPermissionMutation,
} from '../api/permissionApi';

export const usePermissionUpsert = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation(['permission', 'translation']);
  const { goToPermissionList } = useAppNavigate();
  const { message } = useAppNotify();

  const { data: permissionData, isLoading: isDetailLoading } = useGetPermissionByIdQuery(id as string, {
    skip: !id,
  });

  const [addPermission, { isLoading: isAdding }] = useAddPermissionMutation();
  const [editPermission, { isLoading: isEditing }] = useEditPermissionMutation();

  const handleSave = async (values: any) => {
    try {
      if (id) {
        await editPermission({ id, body: values }).unwrap();
        message.success(t('messages.updateSuccess'));
      } else {
        await addPermission(values).unwrap();
        message.success(t('messages.createSuccess'));
      }
      goToPermissionList();
    } catch (error: any) {
      message.error(error?.data?.message || t('common.messages.errorOccurred', { ns: 'translation' }));
    }
  };

  return {
    id,
    t,
    goToPermissionList,
    currentPermission: permissionData?.result || null,
    loading: isAdding || isEditing,
    isDetailLoading,
    handleSave,
  };
};
