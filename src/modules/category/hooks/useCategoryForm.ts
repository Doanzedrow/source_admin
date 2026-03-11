import { useEffect } from 'react';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { toSlug } from '@/utils/format';
import type { Category } from '../data/category.types';

interface UseCategoryFormProps {
  initialValues: Category | null;
  onSave: (values: any) => void;
  isEdit?: boolean;
}

export const useCategoryForm = ({ initialValues, onSave, isEdit = false }: UseCategoryFormProps) => {
  const { t } = useTranslation(['category', 'translation']);
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: 1, type: 1 });
    }
  }, [initialValues, form]);

  const handleValuesChange = (changedValues: any) => {
    if (changedValues.name) {
      form.setFieldsValue({ slug: toSlug(changedValues.name) });
    }
  };

  const onFinish = (values: any) => {
    onSave(values);
  };

  return {
    form,
    onFinish,
    handleValuesChange,
    t,
    isEdit,
  };
};
