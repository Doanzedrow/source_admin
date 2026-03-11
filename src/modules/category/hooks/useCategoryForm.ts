import { useEffect } from 'react';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppNotify } from '@/hooks/useAppNotify';
import { 
  useCreateCategoryMutation, 
  useUpdateCategoryMutation, 
  useGetCategoryByIdQuery 
} from '../api/categoryApi';
import { toSlug } from '@/utils/format';
import { rc, RouteKey } from '@/routes/routeConfig';

export const useCategoryForm = (isEdit = false) => {
  const { t } = useTranslation(['category', 'translation']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notification } = useAppNotify();
  const [form] = Form.useForm();

  const { data: categoryData, isLoading: isFetching } = useGetCategoryByIdQuery(id!, {
    skip: !isEdit || !id,
  });

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  useEffect(() => {
    if (isEdit && categoryData?.result) {
      form.setFieldsValue(categoryData.result);
    }
  }, [isEdit, categoryData, form]);

  const handleValuesChange = (changedValues: any) => {
    if (changedValues.name) {
      form.setFieldsValue({ slug: toSlug(changedValues.name) });
    }
  };

  const onFinish = async (values: any) => {
    try {
      if (isEdit && id) {
        await updateCategory({ id, body: values }).unwrap();
        notification.success({
          message: t('messages.updateSuccess'),
        });
      } else {
        await createCategory(values).unwrap();
        notification.success({
          message: t('messages.createSuccess'),
        });
      }
      navigate(rc(RouteKey.Category).path);
    } catch (error: any) {
      notification.error({
        message: isEdit ? t('messages.updateError') : t('messages.createError'),
        description: error?.data?.message || error?.message,
      });
    }
  };

  return {
    form,
    onFinish,
    handleValuesChange,
    isLoading: isCreating || isUpdating || isFetching,
    t,
    isEdit,
  };
};
