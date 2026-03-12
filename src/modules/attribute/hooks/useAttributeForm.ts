import { useEffect } from 'react';
import { Form } from 'antd';
import type { Attribute } from '../data/attribute.types';

interface UseAttributeFormProps {
  initialValues: Attribute | null;
  onSave: (values: any) => void;
}

export const useAttributeForm = ({ initialValues, onSave }: UseAttributeFormProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ 
        status: 1,
        isMultiple: false,
        maxSelect: 1,
        overridePrice: false,
        variants: [],
      });
    }
  }, [initialValues, form]);

  const handleSubmit = (values: any) => {
    const trimmed = {
      ...values,
      code: values.code?.trim(),
      name: values.name?.trim(),
    };

    // Ensure variants are cleaned up if necessary
    if (trimmed.variants) {
      trimmed.variants = trimmed.variants.map((v: any) => ({
        ...v,
        name: v.name?.trim(),
        code: v.code?.trim(),
        status: v.status ?? 1,
      }));
    }

    onSave(trimmed);
  };

  return {
    form,
    handleSubmit,
  };
};
