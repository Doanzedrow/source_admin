import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import { useAppNotify } from '@/hooks/useAppNotify';
import { 
  useGetAttributeByIdQuery, 
  useCreateAttributeMutation, 
  useUpdateAttributeMutation 
} from '../api/attributeApi';

export const useAttributeUpsert = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation(['attribute', 'translation']);
  const { goToAttributes } = useAppNavigate();
  const { notification } = useAppNotify();

  const { data: detailData, isLoading: isDetailLoading } = useGetAttributeByIdQuery(id as string, { skip: !id });
  const [createAttribute, { isLoading: isCreating }] = useCreateAttributeMutation();
  const [updateAttribute, { isLoading: isUpdating }] = useUpdateAttributeMutation();

  const currentAttribute = detailData?.result || null;
  const loading = isCreating || isUpdating;

  const handleSave = async (values: any) => {
    try {
      if (id) {
        await updateAttribute({ id, body: values }).unwrap();
        notification.success({
          title: t('common.messages.success', { ns: 'translation' }),
          description: t('messages.updateSuccess'),
        });
      } else {
        await createAttribute(values).unwrap();
        notification.success({
          title: t('common.messages.success', { ns: 'translation' }),
          description: t('messages.createSuccess'),
        });
      }
      goToAttributes();
    } catch (error: any) {
      notification.error({
        title: id ? t('messages.updateError') : t('messages.createError'),
        description: error?.data?.message || error?.message,
      });
    }
  };

  return {
    id,
    t,
    goToAttributes,
    currentAttribute,
    loading,
    isDetailLoading,
    handleSave,
  };
};
