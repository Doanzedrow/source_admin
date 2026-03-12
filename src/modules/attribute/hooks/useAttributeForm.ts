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
        status: initialValues.status === 1,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ 
        status: true,
        isMultiple: false,
        overridePrice: false,
      });
    }
  }, [initialValues, form]);

  const handleSubmit = (values: any) => {
    const trimmed = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v])
    );

    const payload: any = {
      ...trimmed,
      status: trimmed.status ? 1 : 0,
    };

    onSave(payload);
  };

  return {
    form,
    handleSubmit,
  };
};
