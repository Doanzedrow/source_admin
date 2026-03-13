import { useMemo, useEffect } from 'react';
import { Form } from 'antd';
import type { Service } from '../data/service.types';
import { PRODUCT_TYPE } from '../../product/data/product.constants';
import { useGetAllCategoriesQuery } from '@/modules/category/api/categoryApi';

interface UseServiceFormProps {
  initialValues: Service | null;
  onSave: (values: any) => void;
}

const safeParseNumber = (val: any): number => {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') return val;
  const cleaned = String(val).replace(/\D/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
};

export const useServiceForm = ({ initialValues, onSave }: UseServiceFormProps) => {
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
      form.setFieldsValue({
        status: true,
        taxPercentage: 0,
        priceSale: 0,
        priceSaleWithTax: 0,
      });
    }
  }, [initialValues, form]);

  const initialMediaPaths = useMemo(() => {
    return {
      thumb:
        initialValues?.thumbnail?.thumbnail?.sizes?.product_square?.path ||
        initialValues?.thumbnail?.thumbnail?.path ||
        '',
      origin: initialValues?.thumbnail?.thumbnail?.path || '',
    };
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
    const priceSale = safeParseNumber(values.priceSale);
    const taxPercentage = safeParseNumber(values.taxPercentage);
    const priceSaleWithTax = safeParseNumber(values.priceSaleWithTax);

    const payload: any = {
      ...values,
      code: values.code?.trim(),
      name: values.name?.trim(),
      type: PRODUCT_TYPE.SERVICE, // Force type 2
      status: values.status ? 1 : 0,
      priceSale,
      taxPercentage,
      priceSaleWithTax,
      taxAmount: priceSaleWithTax - priceSale,
      thumbnail: values.thumbnail || null,
      category: values.category || null,
    };

    onSave(payload);
  };

  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery({
    type: 2, // Use type 2 for service categories
  });

  const categories = useMemo(() => {
    return categoriesData?.result || [];
  }, [categoriesData]);

  return {
    form,
    onValuesChange,
    handleSubmit,
    categories,
    isCategoriesLoading,
    initialMediaPaths,
  };
};
