import React, { memo } from 'react';
import { Form, Select, Flex } from 'antd';
import { DeleteOutlined, TagsOutlined, PlusOutlined } from '@ant-design/icons';
import { AppCard } from '@/components/common/AppCard';
import { AppButton } from '@/components/common/AppButton';
import { AppInputPrice } from '@/components/common/AppInputPrice';
import { AppMediaUpload } from '@/components/common/AppMediaUpload';
import { AppTable } from '@/components/common/AppTable';
import { useProductVariantSelector } from '../hooks/useProductVariantSelector';


export const ProductVariantSelector: React.FC = () => {
  const { 
    t, 
    attributeOptions, 
    getVariantsByAttributeId, 
    isAttributesLoading 
  } = useProductVariantSelector();

  const form = Form.useFormInstance();

  return (
    <AppCard 
      className="product-variant-selector-card"
      collapsible
      defaultCollapsed={true}
      title={
        <Flex gap={8} align="center">
          <TagsOutlined style={{ color: 'var(--primary-color)' }} />
          <span>{t('form.variants', { ns: 'attribute' })}</span>
        </Flex>
      }
    >
      <Form.List name="variants">
        {(fields, { add, remove }) => {
          const columns = [
            {
              title: t('columns.index', { ns: 'attribute' }),
              key: 'index',
              width: 50,
              render: (_: any, __: any, index: number) => index + 1,
            },
            {
              title: t('form.attribute', { ns: 'attribute' }),
              dataIndex: 'attribute',
              key: 'attribute',
              width: 180,
              render: (_: any, field: any) => {
                const { key, ...restField } = field;
                return (
                  <Form.Item shouldUpdate noStyle key={key}>
                    {({ getFieldValue }) => {
                      const allVariants = getFieldValue('variants') || [];
                      
                      const filteredAttributeOptions = attributeOptions.filter(attr => {
                        const availableVariants = getVariantsByAttributeId(attr.value);
                        if (availableVariants.length === 0) return false;

                        const selectedVariantsForThisAttr = allVariants
                          .filter((v: any, idx: number) => v.attribute === attr.value && idx !== field.name)
                          .map((v: any) => v.variant);

                        return selectedVariantsForThisAttr.length < availableVariants.length;
                      });

                      return (
                        <Form.Item
                          {...restField}
                          name={[field.name, 'attribute']}
                          rules={[{ required: true, message: '' }]}
                          noStyle
                        >
                          <Select
                            showSearch
                            placeholder={t('placeholder.selectAttribute', { ns: 'attribute' })}
                            options={filteredAttributeOptions}
                            loading={isAttributesLoading}
                            size="large"
                            style={{ width: '100%' }}
                            onChange={() => {
                              form.setFieldValue(['variants', field.name, 'variant'], undefined);
                            }}
                          />
                        </Form.Item>
                      );
                    }}
                  </Form.Item>
                );
              },
            },
            {
              title: t('form.variant', { ns: 'attribute' }),
              dataIndex: 'variant',
              key: 'variant',
              width: 200,
              render: (_: any, field: any) => {
                const { key, ...restField } = field;
                return (
                  <Form.Item shouldUpdate noStyle key={key}>
                    {({ getFieldValue }) => {
                      const allVariants = getFieldValue('variants') || [];
                      const currentAttributeId = getFieldValue(['variants', field.name, 'attribute']);
                      
                      if (!currentAttributeId) {
                        return (
                          <Select
                            placeholder={t('form.variantName', { ns: 'attribute' })}
                            disabled
                            size="large"
                            style={{ width: '100%' }}
                          />
                        );
                      }

                      const selectedVariantIds = allVariants
                        .filter((v: any, idx: number) => v.attribute === currentAttributeId && idx !== field.name && v.variant)
                        .map((v: any) => v.variant);

                      const variantOptions = getVariantsByAttributeId(currentAttributeId)
                        .filter(v => !selectedVariantIds.includes(v._id))
                        .map(v => ({
                          label: v.name,
                          value: v._id,
                        }));

                      return (
                        <Form.Item
                          {...restField}
                          name={[field.name, 'variant']}
                          rules={[{ required: true, message: '' }]}
                          noStyle
                        >
                          <Select
                            showSearch
                            placeholder={t('form.variantName', { ns: 'attribute' })}
                            options={variantOptions}
                            size="large"
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      );
                    }}
                  </Form.Item>
                );
              },
            },
            {
              title: t('form.price', { ns: 'attribute' }),
              dataIndex: 'price',
              key: 'price',
              width: 160,
              render: (_: any, field: any) => {
                const { key, ...restField } = field;
                return (
                  <AppInputPrice
                    key={key}
                    {...restField}
                    name={[field.name, 'price']}
                    placeholder={t('common.price', { ns: 'translation' })}
                    noStyle
                  />
                );
              },
            },
            {
              title: t('form.priceAfterTax', { ns: 'product' }),
              dataIndex: 'priceWithTax',
              key: 'priceWithTax',
              width: 160,
              render: (_: any, field: any) => {
                const { key, ...restField } = field;
                return (
                  <AppInputPrice
                    key={key}
                    {...restField}
                    name={[field.name, 'priceWithTax']}
                    placeholder={t('form.priceAfterTax', { ns: 'product' })}
                    noStyle
                  />
                );
              },
            },
            {
              title: t('form.image', { ns: 'attribute' }),
              dataIndex: 'thumbnail',
              key: 'thumbnail',
              width: 100,
              render: (_: any, field: any) => {
                const variantData = form.getFieldValue(['variants', field.name]);
                const { key, ...restField } = field;
                return (
                  <Form.Item
                    key={key}
                    {...restField}
                    name={[field.name, 'thumbnail']}
                    noStyle
                  >
                    <AppMediaUpload 
                      maxCount={1} 
                      type="product"
                      initialValuePath={variantData?.thumbnailPath}
                    />
                  </Form.Item>
                );
              },
            },
            {
              title: t('columns.action', { ns: 'attribute' }),
              key: 'action',
              width: 80,
              align: 'center' as const,
              render: (_: any, field: any) => (
                <AppButton
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => remove(field.name)}
                />
              ),
            },
          ];

          return (
            <Flex vertical gap={16} style={{ width: '100%' }}>
              <AppTable
                dataSource={fields}
                columns={columns}
                rowKey="key"
                pagination={false}
                hidePagination
              />
              <AppButton 
                type="dashed" 
                onClick={() => add({ price: 0, priceWithTax: 0 })} 
                block 
                icon={<PlusOutlined />}
                size="large"
              >
                {t('common.actions.create', { ns: 'translation' })} {t('form.variant', { ns: 'attribute' })}
              </AppButton>
            </Flex>
          );
        }}
      </Form.List>
    </AppCard>
  );
};

export default memo(ProductVariantSelector);
