import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import { useAppNotify } from '@/hooks/useAppNotify';
import { 
  useGetServiceByIdQuery, 
  useCreateServiceMutation, 
  useUpdateServiceMutation 
} from '../api/serviceApi';
import { PRODUCT_TYPE } from '../../product/data/product.constants';

export const useServiceUpsert = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation(['service', 'translation']);
  const { goToServiceList } = useAppNavigate();
  const { notification } = useAppNotify();

  const { data: detailData, isLoading: isDetailLoading } = useGetServiceByIdQuery(id as string, { skip: !id });
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();

  const currentService = detailData?.result || null;
  const loading = isCreating || isUpdating;

  const handleSave = async (values: any) => {
    try {
      if (id) {
        await updateService({ id, body: { ...values, type: PRODUCT_TYPE.SERVICE } }).unwrap();
        notification.success({
          title: t('common.messages.success', { ns: 'translation' }),
          description: t('messages.updateSuccess'),
        });
      } else {
        await createService({ ...values, type: PRODUCT_TYPE.SERVICE }).unwrap();
        notification.success({
          title: t('common.messages.success', { ns: 'translation' }),
          description: t('messages.createSuccess'),
        });
      }
      goToServiceList();
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
    goToServiceList,
    currentService,
    loading,
    isDetailLoading,
    handleSave,
  };
};
