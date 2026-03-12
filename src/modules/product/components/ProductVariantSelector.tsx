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
              render: (_: any, field: any) => (
                <Form.Item
                  {...field}
                  name={[field.name, 'attribute']}
                  rules={[{ required: true, message: '' }]}
                  noStyle
                >
                  <Select
                    showSearch
                    placeholder={t('placeholder.selectAttribute', { ns: 'attribute' })}
                    options={attributeOptions}
                    loading={isAttributesLoading}
                    size="large"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              ),
            },
            {
              title: t('form.variant', { ns: 'attribute' }),
              dataIndex: 'variant',
              key: 'variant',
              width: 200,
              render: (_: any, field: any) => (
                <Form.Item shouldUpdate={(prev, curr) => prev.variants?.[field.name]?.attribute !== curr.variants?.[field.name]?.attribute} noStyle>
                  {({ getFieldValue }) => {
                    const attributeId = getFieldValue(['variants', field.name, 'attribute']);
                    const variantOptions = getVariantsByAttributeId(attributeId).map(v => ({
                      label: v.name,
                      value: v._id,
                    }));

                    return (
                      <Form.Item
                        {...field}
                        name={[field.name, 'variant']}
                        rules={[{ required: true, message: '' }]}
                        noStyle
                      >
                        <Select
                          showSearch
                          placeholder={t('form.variantName', { ns: 'attribute' })}
                          options={variantOptions}
                          disabled={!attributeId}
                          size="large"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
              ),
            },
            {
              title: t('form.price', { ns: 'attribute' }),
              dataIndex: 'price',
              key: 'price',
              width: 160,
              render: (_: any, field: any) => (
                <AppInputPrice
                  {...field}
                  name={[field.name, 'price']}
                  placeholder={t('common.price', { ns: 'translation' })}
                  noStyle
                />
              ),
            },
            {
              title: t('form.priceAfterTax', { ns: 'product' }),
              dataIndex: 'priceWithTax',
              key: 'priceWithTax',
              width: 160,
              render: (_: any, field: any) => (
                <AppInputPrice
                  {...field}
                  name={[field.name, 'priceWithTax']}
                  placeholder={t('form.priceAfterTax', { ns: 'product' })}
                  noStyle
                />
              ),
            },
            {
              title: t('form.image', { ns: 'attribute' }),
              dataIndex: 'thumbnail',
              key: 'thumbnail',
              width: 100,
              render: (_: any, field: any) => {
                const variantData = form.getFieldValue(['variants', field.name]);
                return (
                  <Form.Item
                    {...field}
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
