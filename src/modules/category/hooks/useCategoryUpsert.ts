import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppNotify } from '@/hooks/useAppNotify';
import { rc, RouteKey } from '@/routes/routeConfig';
import { 
  useGetCategoryByIdQuery, 
  useCreateCategoryMutation, 
  useUpdateCategoryMutation 
} from '../api/categoryApi';

export const useCategoryUpsert = () => {
  const { t } = useTranslation(['category', 'translation']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notification } = useAppNotify();

  const { data: categoryData, isLoading: isDetailLoading } = useGetCategoryByIdQuery(id!, {
    skip: !id,
  });

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  const handleSave = async (values: any) => {
    try {
      if (id) {
        await updateCategory({ id, body: values }).unwrap();
        notification.success({ title: t('messages.updateSuccess') });
      } else {
        await createCategory(values).unwrap();
        notification.success({ title: t('messages.createSuccess') });
      }
      navigate(rc(RouteKey.Category).path);
    } catch (error: any) {
      notification.error({
        title: id ? t('messages.updateError') : t('messages.createError'),
        description: error?.data?.message || error?.message,
      });
    }
  };

  const goToCategories = () => navigate(rc(RouteKey.Category).path);

  return {
    id,
    t,
    goToCategories,
    currentCategory: categoryData?.result || null,
    loading: isCreating || isUpdating,
    isDetailLoading,
    handleSave,
  };
};
