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
    }),
    []
  );

  useEffect(() => {
    if (isLoading) return;

    if (initialValues) {
      const { code, name, status, isMultiple, maxSelect, overridePrice } = initialValues;
      form.setFieldsValue({
        code,
        name,
        status,
        isMultiple,
        maxSelect,
        overridePrice,
      });
    } else {
      form.setFieldsValue(defaultValues);
    }
  }, [initialValues, form, defaultValues, isLoading]);

  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      code: values.code?.trim(),
      name: values.name?.trim(),
    };

    onSave(payload);
  };

  return {
    form,
    handleSubmit,
    defaultValues: initialValues || defaultValues,
  };
};
