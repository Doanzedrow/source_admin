import { useEffect, useState } from 'react';
import { Form } from 'antd';
import type { Product } from '../data/product.types';

interface UseProductFormProps {
  initialValues: Product | null;
  onSave: (values: any) => void;
}

export const useProductForm = ({ initialValues, onSave }: UseProductFormProps) => {
  const [form] = Form.useForm();
  const [priceSaleWithTax, setPriceSaleWithTax] = useState<number>(0);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        category: initialValues.category?._id,
        thumbnail: initialValues.thumbnail?.thumbnail?.path || initialValues.thumbnail?.thumbnail?.sizes?.product_square?.path || '',
        status: initialValues.status === 1,
      });
      recalculatePrice(
        initialValues.priceSale ?? 0,
        initialValues.taxPercentage ?? 0,
      );
    } else {
      form.resetFields();
      form.setFieldsValue({ status: true });
      setPriceSaleWithTax(0);
    }
  }, [initialValues, form]);

  const recalculatePrice = (price: number, vat: number) => {
    const calculated = Math.round(price * (1 + vat / 100));
    setPriceSaleWithTax(calculated);
  };

  const onValuesChange = (changed: any, all: any) => {
    if ('priceSale' in changed || 'taxPercentage' in changed) {
      const price = Number(all.priceSale) || 0;
      const vat = Number(all.taxPercentage) || 0;
      recalculatePrice(price, vat);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const trimmed = Object.fromEntries(
        Object.entries(values).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v])
      );
      
      onSave({ 
        ...trimmed, 
        status: trimmed.status ? 1 : 0,
        priceSaleWithTax,
        taxAmount: priceSaleWithTax - (Number(trimmed.priceSale) || 0)
      });
    } catch {
    }
  };

  return {
    form,
    handleSubmit,
    onValuesChange,
    priceSaleWithTax,
  };
};
