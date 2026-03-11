import React, { useEffect } from 'react';
import { 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Upload, 
  Button, 
  Flex, 
  Typography,
  Divider,
  Card
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { Product } from '../data/product.types';

const { Title } = Typography;
const { TextArea } = Input;

interface ProductFormProps {
  onSave: (values: any) => void;
  loading: boolean;
  initialValues: Product | null;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  onSave,
  loading,
  initialValues,
  onCancel,
}) => {
  const { t } = useTranslation(['product', 'translation']);
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        category: initialValues.category?._id,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
    } catch (error) {
      console.error('Validate failed:', error);
    }
  };

  return (
    <Card bordered={false} className="product-form-card">
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
        <section>
          <Title level={5}>{t('infoBasic')}</Title>
          <Form.Item
            name="name"
            label={t('form.name')}
            rules={[{ required: true, message: t('validation.required', { field: t('form.name') }) }]}
          >
            <Input placeholder={t('placeholder.name')} size="large" />
          </Form.Item>

          <Flex gap={16} wrap="wrap">
            <Form.Item
              name="code"
              label={t('form.code')}
              style={{ flex: '1 1 200px' }}
              rules={[{ required: true, message: t('validation.required', { field: t('form.code') }) }]}
            >
              <Input placeholder={t('placeholder.code')} />
            </Form.Item>
            <Form.Item
              name="category"
              label={t('form.category')}
              style={{ flex: '1 1 200px' }}
              rules={[{ required: true, message: t('validation.required', { field: t('form.category') }) }]}
            >
              <Select placeholder={t('placeholder.category')}>
                <Select.Option value="cat1">Category 1</Select.Option>
                <Select.Option value="cat2">Category 2</Select.Option>
              </Select>
            </Form.Item>
          </Flex>
        </section>

        <Divider />

        <section>
          <Title level={5}>{t('infoPricing')}</Title>
          <Flex gap={16} wrap="wrap">
            <Form.Item
              name="priceSale"
              label={t('form.priceSale')}
              style={{ flex: '1 1 200px' }}
              rules={[{ required: true, message: t('validation.required', { field: t('form.priceSale') }) }]}
            >
              <InputNumber
                style={{ width: '100%' }}
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
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </Flex>

          <Form.Item
            name="stockCount"
            label={t('form.stock')}
            rules={[{ required: true, message: t('validation.required', { field: t('form.stock') }) }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </section>

        <Divider />

        <section>
          <Title level={5}>{t('infoMedia')}</Title>
          <Form.Item label={t('form.image')}>
            <Upload listType="picture-card" maxCount={1} beforeUpload={() => false}>
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>{t('common.actions.upload', { ns: 'translation' })}</div>
              </div>
            </Upload>
          </Form.Item>
        </section>

        <Divider />

        <section>
          <Title level={5}>{t('infoDescription')}</Title>
          <Form.Item name="description" label={t('form.description')}>
            <TextArea rows={6} placeholder={t('placeholder.description')} />
          </Form.Item>
        </section>

        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button size="large" onClick={onCancel}>
            {t('common.actions.cancel', { ns: 'translation' })}
          </Button>
          <Button size="large" type="primary" onClick={handleSubmit} loading={loading} style={{ minWidth: 120 }}>
            {t('common.actions.save', { ns: 'translation' })}
          </Button>
        </div>
      </Form>
    </Card>
  );
};
