import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import { useAppNotify } from '@/hooks/useAppNotify';
import { 
  useGetProductByIdQuery, 
  useCreateProductMutation, 
  useUpdateProductMutation 
} from '../api/productApi';
import { PRODUCT_TYPE } from '../data/product.constants';

export const useProductUpsert = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation(['product', 'translation']);
  const { goToProducts } = useAppNavigate();
  const { notification } = useAppNotify();

  const { data: detailData, isLoading: isDetailLoading } = useGetProductByIdQuery(id as string, { skip: !id });
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const currentProduct = detailData?.result || null;
  const loading = isCreating || isUpdating;

  const handleSave = async (values: any) => {
    try {
      if (id) {
        await updateProduct({ id, body: { ...values, type: PRODUCT_TYPE.REGULAR } }).unwrap();
        notification.success({
          message: t('common.messages.success', { ns: 'translation' }),
          description: t('messages.updateSuccess'),
        });
      } else {
        await createProduct({ ...values, type: PRODUCT_TYPE.REGULAR }).unwrap();
        notification.success({
          message: t('common.messages.success', { ns: 'translation' }),
          description: t('messages.createSuccess'),
        });
      }
      goToProducts();
    } catch (error: any) {
      notification.error({
        message: id ? t('messages.updateError') : t('messages.createError'),
        description: error?.data?.message || error?.message,
      });
    }
  };

  return {
    id,
    t,
    goToProducts,
    currentProduct,
    loading,
    isDetailLoading,
    handleSave,
  };
};
