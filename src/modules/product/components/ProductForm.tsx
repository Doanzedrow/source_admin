import React from 'react';
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Typography,
  Switch,
  InputNumber,
  Space,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/common/AppInput';
import { AppInputNumber } from '@/components/common/AppInputNumber';
import { AppInputPrice } from '@/components/common/AppInputPrice';
import { FormActions } from '@/components/common/FormActions';
import { AppMediaUpload } from '@/components/common/AppMediaUpload';
import type { Product } from '../data/product.types';
import { useProductForm } from '../hooks/useProductForm';
import { REGEX } from '@/utils/regex';

import '../styles/product-form.less';

const { TextArea } = Input;

const VAT_OPTIONS = [0, 5, 8, 10];

interface ProductFormProps {
  onSave: (values: any) => void;
  loading: boolean;
  initialValues: Product | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  onSave,
  loading,
  initialValues,
}) => {
  const { t } = useTranslation(['product', 'translation']);
  const { form, handleSubmit, onValuesChange, priceSaleWithTax } = useProductForm({ initialValues, onSave });

  return (
    <div className="product-form-container">
      <Form
        form={form}
        layout="vertical" 
        disabled={loading}
        initialValues={{ taxPercentage: 0, status: true }}
        onValuesChange={onValuesChange}
        scrollToFirstError
      >
        <Row gutter={[24, 0]}>
          <Col xs={24} lg={16}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <AppInput
                  name="code"
                  label={t('form.code')}
                  placeholder={t('placeholder.code')}
                  rules={[{ required: true, message: t('validation.required', { field: t('form.code') }) }]}
                  regex={REGEX.PRODUCT_CODE}
                  regexMessage={t('validation.invalidCode')}
                />
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="category"
                  label={t('form.category')}
                  rules={[{ required: true, message: t('validation.required', { field: t('form.category') }) }]}
                  htmlFor="category"
                >
                  <Select id="category" placeholder={t('placeholder.category')} size="large">
                    <Select.Option value="cat1">{t('placeholder.categoryMock1')}</Select.Option>
                    <Select.Option value="cat2">{t('placeholder.categoryMock2')}</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <AppInput
              name="name"
              label={t('form.name')}
              placeholder={t('placeholder.name')}
              rules={[{ required: true, message: t('validation.required', { field: t('form.name') }) }]}
              regex={REGEX.PRODUCT_NAME}
              regexMessage={t('validation.invalidName')}
            />

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <AppInputPrice
                  name="priceSale"
                  label={t('form.priceSale')}
                  placeholder={t('placeholder.price')}
                  rules={[{ required: true, message: t('validation.required', { field: t('form.priceSale') }) }]}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Form.Item name="taxPercentage" label={t('form.taxPercentage')} htmlFor="taxPercentage">
                  <Select id="taxPercentage" size="large">
                    {VAT_OPTIONS.map((v) => (
                      <Select.Option key={v} value={v}>{v}%</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={12} sm={6}>
                <Form.Item label={t('form.priceAfterTax')} htmlFor="priceSaleWithTax">
                  <Space.Compact style={{ width: '100%' }}>
                    <InputNumber
                      id="priceSaleWithTax"
                      size="large"
                      style={{ width: '100%' }}
                      value={priceSaleWithTax}
                      formatter={(v) => v ? Number(v).toLocaleString('vi-VN') : ''}
                      parser={(v) => Number(v?.replace(/\./g, '').replace(/,/g, '') ?? 0)}
                      disabled
                    />
                    <span className="app-input-price-suffix">₫</span>
                  </Space.Compact>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <AppInputNumber
                  name="stockCount"
                  label={t('form.stock')}
                  rules={[{ required: true, message: t('validation.required', { field: t('form.stock') }) }]}
                  min={0}
                  placeholder="0"
                />
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="status" label={t('form.status')} htmlFor="status">
                  <Select id="status" size="large">
                    <Select.Option value={true}>{t('status.active')}</Select.Option>
                    <Select.Option value={false}>{t('status.inactive')}</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="description" label={t('form.description')} htmlFor="description">
              <TextArea id="description" rows={4} placeholder={t('placeholder.description')} />
            </Form.Item>
          </Col>

          <Col xs={24} lg={8}>
            <div className="media-panel">
              <Form.Item name="thumbnail" label={t('form.image')} style={{ marginBottom: 8 }}>
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
          <AppButton size="large" type="primary" onClick={handleSubmit} loading={loading} style={{ minWidth: 120 }}>
            {t('common.actions.confirm', { ns: 'translation' })}
          </AppButton>
        </FormActions>
      </Form>
    </div>
  );
};
