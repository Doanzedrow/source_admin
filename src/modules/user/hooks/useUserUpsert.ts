import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppNotify } from '@/hooks/useAppNotify';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import { 
  useGetUserByIdQuery, 
  useAddUserMutation, 
  useEditUserMutation 
} from '../api/userApi';

export const useUserUpsert = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation(['user', 'translation']);
  const { notification } = useAppNotify();
  const { goToUserList } = useAppNavigate() as any;

  const { data: userResponse, isLoading: isDetailLoading } = useGetUserByIdQuery(id!, {
    skip: !id,
  });

  const [addUser, { isLoading: isAdding }] = useAddUserMutation();
  const [editUser, { isLoading: isEditing }] = useEditUserMutation();

  const handleSave = async (values: any) => {
    try {
      if (id) {
        await editUser({ id, body: values }).unwrap();
        notification.success({
          title: t('common.messages.success', { ns: 'translation' }),
          description: t('messages.updateSuccess'),
        });
      } else {
        await addUser(values).unwrap();
        notification.success({
          title: t('common.messages.success', { ns: 'translation' }),
          description: t('messages.createSuccess'),
        });
      }
      goToUserList();
    } catch (error: any) {
      notification.error({
        title: t('common.messages.error', { ns: 'translation' }),
        description: error?.data?.message || (id ? t('messages.updateError') : t('messages.createError')),
      });
    }
  };

  return {
    id,
    t,
    goToUserList,
    currentUser: userResponse?.result || null,
    loading: isAdding || isEditing,
    isDetailLoading,
    handleSave,
  };
};
