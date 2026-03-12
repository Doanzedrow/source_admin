import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetAllAttributesQuery } from '@/modules/attribute/api/attributeApi';

export const useProductVariantSelector = () => {
  const { t } = useTranslation(['product', 'attribute', 'translation']);
  const { data: attributesData, isLoading: isAttributesLoading } = useGetAllAttributesQuery();

  const attributes = useMemo(() => attributesData?.result || [], [attributesData]);

 
  const attributeMap = useMemo(() => {
    return attributes.reduce((acc, attr) => {
      acc[attr._id] = attr;
      return acc;
    }, {} as Record<string, typeof attributes[0]>);
  }, [attributes]);

 
  const attributeOptions = useMemo(() => {
    return attributes.map((attr) => ({
      label: attr.name,
      value: attr._id,
      disabled: false, 
    }));
  }, [attributes]);

  
  const getVariantsByAttributeId = (attributeId: string) => {
    return attributeMap[attributeId]?.variants || [];
  };

  return {
    t,
    attributes,
    isAttributesLoading,
    attributeOptions,
    getVariantsByAttributeId,
    attributeMap,
  };
};
