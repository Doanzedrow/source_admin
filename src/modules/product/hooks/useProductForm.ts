import { useEffect } from 'react';
import { Form } from 'antd';
import type { Product } from '../data/product.types';

interface UseProductFormProps {
  initialValues: Product | null;
  onSave: (values: any) => void;
}

/**
 * Safely parses numbers, stripping potential thousand separators.
 */
const safeParseNumber = (val: any): number => {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') return val;
  const cleaned = String(val).replace(/\D/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
};

export const useProductForm = ({ initialValues, onSave }: UseProductFormProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      const priceSale = initialValues.priceSale ?? 0;
      const taxPercentage = initialValues.taxPercentage ?? 0;
      const priceSaleWithTax = Math.round(priceSale * (1 + taxPercentage / 100));

      form.setFieldsValue({
        ...initialValues,
        category: initialValues.category?._id,
        thumbnail:
          initialValues.thumbnail?.thumbnail?.path ||
          initialValues.thumbnail?.thumbnail?.sizes?.product_square?.path ||
          '',
        status: initialValues.status === 1,
        priceSaleWithTax: priceSaleWithTax,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: true, taxPercentage: 0, priceSale: 0, priceSaleWithTax: 0 });
    }
  }, [initialValues, form]);

  /**
   * Universal onValuesChange for bidirectional price calculation.
   */
  const onValuesChange = (changed: any, all: any) => {
    const taxPercentage = safeParseNumber(all.taxPercentage);

    if ('priceSale' in changed || 'taxPercentage' in changed) {
      const priceSale = safeParseNumber(all.priceSale);
      const priceSaleWithTax = Math.round(priceSale * (1 + taxPercentage / 100));
      form.setFieldsValue({ priceSaleWithTax });
    } else if ('priceSaleWithTax' in changed) {
      const priceSaleWithTax = safeParseNumber(all.priceSaleWithTax);
      const priceSale = Math.round(priceSaleWithTax / (1 + taxPercentage / 100));
      form.setFieldsValue({ priceSale });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const trimmed = Object.fromEntries(
        Object.entries(values).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v])
      );

      const priceSale = safeParseNumber(trimmed.priceSale);
      const taxPercentage = safeParseNumber(trimmed.taxPercentage);
      const priceSaleWithTax = safeParseNumber(trimmed.priceSaleWithTax);

      onSave({
        ...trimmed,
        status: trimmed.status ? 1 : 0,
        priceSale,
        taxPercentage,
        priceSaleWithTax,
        taxAmount: priceSaleWithTax - priceSale,
      });
    } catch {}
  };

  return {
    form,
    onValuesChange,
    handleSubmit,
  };
};
