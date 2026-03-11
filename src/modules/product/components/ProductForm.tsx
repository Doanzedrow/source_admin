import React from 'react';
import { 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Upload, 
  Flex, 
  Typography,
  Divider
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/common/AppInput';
import { FormActions } from '@/components/common/FormActions';
import type { Product } from '../data/product.types';
import { useProductForm } from '../hooks/useProductForm';

import '../styles/product-form.less';

const { Title } = Typography;
const { TextArea } = Input;

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
  const { form, handleSubmit } = useProductForm({ initialValues, onSave });

  return (
    <div className="product-form-container">
      <Form
        form={form}
        layout="vertical"
        disabled={loading}
        initialValues={{
          taxPercentage: 0,
          status: 1,
        }}
        scrollToFirstError
      >
        <div className="form-section">
          <Title level={5} className="section-title">{t('infoBasic')}</Title>
          <AppInput
            name="name"
            label={t('form.name')}
            placeholder={t('placeholder.name')}
            rules={[{ required: true, message: t('validation.required', { field: t('form.name') }) }]}
          />

          <Flex gap={16} wrap="wrap">
            <AppInput
              name="code"
              label={t('form.code')}
              placeholder={t('placeholder.code')}
              style={{ flex: '1 1 200px' }}
              rules={[{ required: true, message: t('validation.required', { field: t('form.code') }) }]}
            />
            <Form.Item
              name="category"
              label={t('form.category')}
              style={{ flex: '1 1 200px' }}
              rules={[{ required: true, message: t('validation.required', { field: t('form.category') }) }]}
            >
              <Select placeholder={t('placeholder.category')} size="large">
                <Select.Option value="cat1">{t('placeholder.categoryMock1')}</Select.Option>
                <Select.Option value="cat2">{t('placeholder.categoryMock2')}</Select.Option>
              </Select>
            </Form.Item>
          </Flex>
        </div>

        <Divider />

        <div className="form-section">
          <Title level={5} className="section-title">{t('infoPricing')}</Title>
          <Flex gap={16} wrap="wrap">
            <Form.Item
              name="priceSale"
              label={t('form.priceSale')}
              style={{ flex: '1 1 200px' }}
              rules={[{ required: true, message: t('validation.required', { field: t('form.priceSale') }) }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                size="large"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                placeholder={t('placeholder.price')}
              />
            </Form.Item>
            <Form.Item
              name="taxPercentage"
              label={t('form.taxPercentage')}
              style={{ flex: '0.5 1 100px' }}
            >
              <InputNumber min={0} max={100} size="large" style={{ width: '100%' }} />
            </Form.Item>
          </Flex>

          <Form.Item
            name="stockCount"
            label={t('form.stock')}
            rules={[{ required: true, message: t('validation.required', { field: t('form.stock') }) }]}
          >
            <InputNumber min={0} size="large" style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <Divider />

        <div className="form-section">
          <Title level={5} className="section-title">{t('infoMedia')}</Title>
          <Form.Item label={t('form.image')}>
            <Upload listType="picture-card" maxCount={1} beforeUpload={() => false}>
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>{t('common.actions.upload', { ns: 'translation' })}</div>
              </div>
            </Upload>
          </Form.Item>
        </div>

        <Divider />

        <div className="form-section">
          <Title level={5} className="section-title">{t('infoDescription')}</Title>
          <Form.Item name="description" label={t('form.description')}>
            <TextArea rows={6} placeholder={t('placeholder.description')} />
          </Form.Item>
        </div>

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
