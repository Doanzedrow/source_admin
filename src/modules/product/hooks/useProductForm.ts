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
        variants: (initialValues.variants || []).map((v: any) => {
          const vPrice = v.price ?? 0;
          const vTax = v.taxPercentage ?? taxPercentage; // Fallback to product level tax
          return {
            ...v,
            attribute: typeof v.attribute === 'object' ? v.attribute?._id : v.attribute,
            variant: typeof v.variant === 'object' ? v.variant?._id : v.variant,
            thumbnail: v.thumbnail?._id || v.thumbnail || '',
            thumbnailPath:
              v.thumbnail?.thumbnail?.sizes?.product_square?.path ||
              v.thumbnail?.thumbnail?.path ||
              '',
            originalPath: v.thumbnail?.thumbnail?.path || '',
            priceWithTax: Math.round(vPrice * (1 + vTax / 100)),
          };
        }),
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        status: true,
        taxPercentage: 0,
        priceSale: 0,
        priceSaleWithTax: 0,
        variants: [],
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

      // If tax change, update all variants priceWithTax accordingly
      if ('taxPercentage' in changed) {
        const variants = all.variants || [];
        variants.forEach((v: any, index: number) => {
          const vPrice = safeParseNumber(v.price);
          form.setFieldValue(
            ['variants', index, 'priceWithTax'],
            Math.round(vPrice * (1 + taxPercentage / 100))
          );
        });
      }
    } else if ('priceSaleWithTax' in changed) {
      const priceSaleWithTax = safeParseNumber(all.priceSaleWithTax);
      const priceSale = Math.round(priceSaleWithTax / (1 + taxPercentage / 100));
      form.setFieldsValue({ priceSale });
    }

    // Handle variant price changes - use targeted setFieldValue to avoid re-mounting components
    if (changed.variants) {
      const changedIndex = changed.variants.findIndex(
        (v: any) => v && ('price' in v || 'priceWithTax' in v)
      );
      if (changedIndex !== -1) {
        const changedVariant = changed.variants[changedIndex];

        if ('price' in changedVariant) {
          const vPrice = safeParseNumber(changedVariant.price);
          form.setFieldValue(
            ['variants', changedIndex, 'priceWithTax'],
            Math.round(vPrice * (1 + taxPercentage / 100))
          );
        } else if ('priceWithTax' in changedVariant) {
          const vPriceWithTax = safeParseNumber(changedVariant.priceWithTax);
          form.setFieldValue(
            ['variants', changedIndex, 'price'],
            Math.round(vPriceWithTax / (1 + taxPercentage / 100))
          );
        }
      }
    }
  };

  const handleSubmit = (values: any) => {
    // Process main values
    const priceSale = safeParseNumber(values.priceSale);
    const taxPercentage = safeParseNumber(values.taxPercentage);
    const priceSaleWithTax = safeParseNumber(values.priceSaleWithTax);

    // Process variants
    const processedVariants = (values.variants || []).map((v: any) => {
      const vPrice = safeParseNumber(v.price);
      const vPriceWithTax = safeParseNumber(v.priceWithTax);

      // Cleanup UI-only fields
      const { thumbnailPath, ...rest } = v;

      return {
        ...rest,
        price: vPrice,
        priceWithTax: vPriceWithTax,
        taxAmount: vPriceWithTax - vPrice,
        thumbnail: v.thumbnail || null,
        taxPercentage: taxPercentage, // Sync tax with main product
      };
    });

    const payload: any = {
      ...values,
      code: values.code?.trim(),
      name: values.name?.trim(),
      type: PRODUCT_TYPE.REGULAR,
      status: values.status ? 1 : 0,
      priceSale,
      taxPercentage,
      priceSaleWithTax,
      taxAmount: priceSaleWithTax - priceSale,
      variants: processedVariants,
      thumbnail: values.thumbnail || null,
      category: values.category || null,
    };

    onSave(payload);
  };

  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery({
    type: 1,
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
