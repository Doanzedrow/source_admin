import { useMemo, useEffect } from 'react';
import { Form } from 'antd';
import type { Product } from '../data/product.types';
import { PRODUCT_TYPE } from '../data/product.constants';
import { useGetAllCategoriesQuery } from '@/modules/category/api/categoryApi';

interface UseProductFormProps {
  initialValues: Product | null;
  onSave: (values: any) => void;
}


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
        thumbnail: initialValues.thumbnail?._id || '',
        status: initialValues.status === 1,
        priceSaleWithTax: priceSaleWithTax,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: true, taxPercentage: 0, priceSale: 0, priceSaleWithTax: 0 });
    }
  }, [initialValues, form]);

  const initialThumbnailPath = useMemo(() => {
    return initialValues?.thumbnail?.thumbnail?.path || 
           initialValues?.thumbnail?.thumbnail?.sizes?.product_square?.path || 
           '';
  }, [initialValues]);

  
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

  const handleSubmit = (values: any) => {
    const trimmed = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v])
    );

    const priceSale = safeParseNumber(trimmed.priceSale);
    const taxPercentage = safeParseNumber(trimmed.taxPercentage);
    const priceSaleWithTax = safeParseNumber(trimmed.priceSaleWithTax);

    const payload: any = {
      ...trimmed,
      type: PRODUCT_TYPE.REGULAR,
      status: trimmed.status ? 1 : 0,
      priceSale,
      taxPercentage,
      priceSaleWithTax,
      taxAmount: priceSaleWithTax - priceSale,
    };

    if (!payload.thumbnail) {
      payload.thumbnail = null;
    }

    onSave(payload);
  };

  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery({ type: 1 });

  const categories = useMemo(() => {
    return categoriesData?.result || [];
  }, [categoriesData]);

  return {
    form,
    onValuesChange,
    handleSubmit,
    categories,
    isCategoriesLoading,
    initialThumbnailPath,
  };
};
