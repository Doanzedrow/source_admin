import { useEffect } from 'react';
import { Form } from 'antd';
import type { Product } from '../data/product.types';

interface UseProductFormProps {
  initialValues: Product | null;
  onSave: (values: any) => void;
}

export const useProductForm = ({ initialValues, onSave }: UseProductFormProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        category: initialValues.category?._id,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
    } catch (error) {
      console.error('Validate failed:', error);
    }
  };

  return {
    form,
    handleSubmit,
  };
};
