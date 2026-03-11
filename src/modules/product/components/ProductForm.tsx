import React, { useMemo } from 'react';
import { Form, Input, Select, Row, Col, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/common/AppInput';
import { AppInputPrice } from '@/components/common/AppInputPrice';
import { FormActions } from '@/components/common/FormActions';
import { AppMediaUpload } from '@/components/common/AppMediaUpload';
import type { Product } from '../data/product.types';
import { useProductForm } from '../hooks/useProductForm';
import { useGetAllCategoriesQuery } from '@/modules/category/api/categoryApi';
import { REGEX } from '@/utils/regex';

import '../styles/product-form.less';

const { TextArea } = Input;

const VAT_OPTIONS = [0, 5, 8, 10];

interface ProductFormProps {
  onSave: (values: any) => void;
  loading: boolean;
  initialValues: Product | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({ onSave, loading, initialValues }) => {
  const { t } = useTranslation(['product', 'translation']);
  const { form, handleSubmit, onValuesChange } = useProductForm({ initialValues, onSave });
  
  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery();
  
  const categories = useMemo(() => {
    return categoriesData?.result || [];
  }, [categoriesData]);

  return (
    <div className="product-form-container">
      <Form
        form={form}
        layout="vertical"
        disabled={loading}
        initialValues={{ priceSale: 0, taxPercentage: 0, status: true, priceSaleWithTax: 0 }}
        onValuesChange={onValuesChange}
        scrollToFirstError
        style={{ padding: '0 4px' }}
      >
        <Row gutter={[24, 0]}>
          <Col xs={24} lg={16}>
            <Row gutter={24}>
              <Col xs={24} sm={8}>
                <AppInput
                  name="code"
                  label={t('form.code')}
                  placeholder={t('placeholder.code')}
                  rules={[
                    {
                      required: true,
                      message: t('validation.required', { field: t('form.code') }),
                    },
                  ]}
                  regex={REGEX.PRODUCT_CODE}
                  regexMessage={t('validation.invalidCode')}
                />
              </Col>
              <Col xs={24} sm={16}>
                <AppInput
                  name="name"
                  label={t('form.name')}
                  placeholder={t('placeholder.name')}
                  rules={[
                    {
                      required: true,
                      message: t('validation.required', { field: t('form.name') }),
                    },
                  ]}
                  regex={REGEX.PRODUCT_NAME}
                  regexMessage={t('validation.invalidName')}
                />
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="category"
                  label={t('form.category')}
                  rules={[
                    {
                      required: true,
                      message: t('validation.required', { field: t('form.category') }),
                    },
                  ]}
                  htmlFor="category"
                >
                  <Select
                    id="category"
                    placeholder={t('placeholder.category')}
                    size="large"
                    showSearch
                    optionFilterProp="children"
                    loading={isCategoriesLoading}
                  >
                    {categories.map((cat) => (
                      <Select.Option key={cat._id} value={cat._id}>
                        {cat.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={16}>
                <Form.Item name="status" label={t('form.status')} htmlFor="status">
                  <Select id="status" size="large">
                    <Select.Option value={true}>{t('status.active')}</Select.Option>
                    <Select.Option value={false}>{t('status.inactive')}</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} md={8}>
                <AppInputPrice
                  name="priceSale"
                  style={{ width: '100%' }}
                  label={t('form.priceSale')}
                  placeholder={t('placeholder.price')}
                  rules={[
                    {
                      required: true,
                      message: t('validation.required', { field: t('form.priceSale') }),
                    },
                  ]}
                />
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="taxPercentage"
                  label={t('form.taxPercentage')}
                  htmlFor="taxPercentage"
                >
                  <Select id="taxPercentage" size="large">
                    {VAT_OPTIONS.map((v) => (
                      <Select.Option key={v} value={v}>
                        {v}%
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <AppInputPrice
                  name="priceSaleWithTax"
                  label={t('form.priceAfterTax')}
                  placeholder={t('placeholder.price')}
                  rules={[
                    {
                      required: true,
                      message: t('validation.required', { field: t('form.priceAfterTax') }),
                    },
                  ]}
                />
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <Form.Item name="description" label={t('form.description')} htmlFor="description">
                  <TextArea id="description" rows={4} placeholder={t('placeholder.description')} />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col xs={24} lg={8}>
            <div className="media-panel">
              <Form.Item name="thumbnail" label={t('form.image')} style={{ marginBottom: 12 }}>
                <AppMediaUpload type="product" maxCount={1} />
              </Form.Item>
              <Typography.Text type="secondary" className="upload-hint">
                {t('form.uploadHint')}
              </Typography.Text>
            </div>
          </Col>
        </Row>

        <FormActions>
          <AppButton size="large" onClick={() => form.resetFields()}>
            {t('common.actions.reset', { ns: 'translation' })}
          </AppButton>
          <AppButton
            size="large"
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            style={{ minWidth: 120 }}
          >
            {t('common.actions.confirm', { ns: 'translation' })}
          </AppButton>
        </FormActions>
      </Form>
    </div>
  );
};
