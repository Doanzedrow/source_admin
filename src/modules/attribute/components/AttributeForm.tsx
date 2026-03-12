import React from 'react';
import { Form, Select, Row, Col, Switch, Typography, InputNumber, Alert } from 'antd';
import { useTranslation } from 'react-i18next';
import { InfoCircleOutlined, SettingOutlined, TagsOutlined } from '@ant-design/icons';
import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/common/AppInput';
import { FormActions } from '@/components/common/FormActions';
import type { Attribute } from '../data/attribute.types';
import { useAttributeForm } from '../hooks/useAttributeForm';
import { REGEX } from '@/utils/regex';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import { VariantManager } from './VariantManager';

const { Text, Paragraph } = Typography;

interface AttributeFormProps {
  onSave: (values: any) => void;
  loading: boolean;
  initialValues: Attribute | null;
}

export const AttributeForm: React.FC<AttributeFormProps> = ({ onSave, loading, initialValues }) => {
  const { t } = useTranslation(['attribute', 'translation']);
  const { form, handleSubmit } = useAttributeForm({ initialValues, onSave });
  const { goToAttributes } = useAppNavigate();

  const isEdit = !!initialValues;
  const isMultiple = Form.useWatch('isMultiple', form);

  return (
    <div className="attribute-form-container">
      <Form
        form={form}
        layout="vertical"
        disabled={loading}
        onFinish={handleSubmit}
        scrollToFirstError
        requiredMark={false}
      >
        {/* Section 1: Basic Information */}
        <div className="form-section">
          <div className="section-title">
            <InfoCircleOutlined /> {t('catalog', { ns: 'translation' })}
          </div>
          <Row gutter={24}>
            <Col xs={24} md={12}>
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
              />
            </Col>
            <Col xs={24} md={12}>
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
              />
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="status" label={t('form.status')} initialValue={1}>
                <Select size="large">
                  <Select.Option value={1}>{t('status.active')}</Select.Option>
                  <Select.Option value={0}>{t('status.inactive')}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Section 2: Configuration */}
        <div className="form-section">
          <div className="section-title">
            <SettingOutlined /> {t('common.actions.filter', { ns: 'translation' })}
          </div>
          
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <Form.Item name="isMultiple" valuePropName="checked" noStyle>
                  <Switch style={{ marginTop: '4px' }} />
                </Form.Item>
                <div>
                  <Text strong style={{ display: 'block' }}>{t('form.isMultiple')}</Text>
                  <Paragraph type="secondary" style={{ marginBottom: 0, fontSize: '13px' }}>
                    {t('form.isMultipleDesc')}
                  </Paragraph>
                </div>
              </div>
              {isMultiple && (
                <div style={{ marginTop: '16px', paddingLeft: '60px' }}>
                   <Form.Item 
                    name="maxSelect" 
                    label={t('form.maxSelect')}
                    rules={[{ required: true }]}
                    initialValue={1}
                  >
                    <InputNumber min={1} style={{ width: '100%' }} size="large" />
                  </Form.Item>
                </div>
              )}
            </Col>

            <Col xs={24} md={12}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <Form.Item name="overridePrice" valuePropName="checked" noStyle>
                  <Switch style={{ marginTop: '4px' }} />
                </Form.Item>
                <div>
                  <Text strong style={{ display: 'block' }}>{t('form.overridePrice')}</Text>
                  <Paragraph type="secondary" style={{ marginBottom: 0, fontSize: '13px' }}>
                    {t('form.overridePriceDesc')}
                  </Paragraph>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Section 3: Variants Management */}
        {isEdit ? (
          <VariantManager 
            attributeId={initialValues!._id} 
            variants={initialValues?.variants || []} 
          />
        ) : (
          <div className="form-section">
            <div className="section-title">
              <TagsOutlined /> {t('form.variants')}
            </div>
            <Alert
              message={t('form.addVariantTip', { defaultValue: 'Vui lòng tạo Biến thể chính trước khi thêm các giá trị cụ thể.' })}
              type="info"
              showIcon
            />
          </div>
        )}

        <FormActions>
          <AppButton onClick={goToAttributes}>
            {t('common.actions.cancel', { ns: 'translation' })}
          </AppButton>
          <AppButton type="primary" htmlType="submit" loading={loading}>
            {isEdit
              ? t('common.actions.update', { ns: 'translation' })
              : t('common.actions.create', { ns: 'translation' })}
          </AppButton>
        </FormActions>
      </Form>
    </div>
  );
};
