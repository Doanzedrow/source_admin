import { useEffect, useMemo } from 'react';
import { Form } from 'antd';
import type { Attribute } from '../data/attribute.types';

interface UseAttributeFormProps {
  initialValues: Attribute | null;
  onSave: (values: any) => void;
  isLoading?: boolean;
}

export const useAttributeForm = ({ initialValues, onSave, isLoading }: UseAttributeFormProps) => {
  const [form] = Form.useForm();

  const defaultValues = useMemo(
    () => ({
      status: 1,
      isMultiple: false,
      maxSelect: 1,
      overridePrice: false,
      variants: [],
    }),
    []
  );

  useEffect(() => {
    // Only set fields when not loading to avoid "not connected" warning
    // Ant Design Form needs to be mounted before setFieldsValue can be called safely
    if (isLoading) return;

    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.setFieldsValue(defaultValues);
    }
  }, [initialValues, form, defaultValues, isLoading]);

  const handleSubmit = (values: any) => {
    const trimmed = {
      ...values,
      code: values.code?.trim(),
      name: values.name?.trim(),
    };

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
    defaultValues: initialValues || defaultValues,
  };
};
