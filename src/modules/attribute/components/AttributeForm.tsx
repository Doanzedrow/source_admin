import React from 'react';
import { Form, Select, Row, Col, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/common/AppInput';
import { FormActions } from '@/components/common/FormActions';
import type { Attribute } from '../data/attribute.types';
import { useAttributeForm } from '../hooks/useAttributeForm';
import { REGEX } from '@/utils/regex';

interface AttributeFormProps {
  onSave: (values: any) => void;
  loading: boolean;
  initialValues: Attribute | null;
}

export const AttributeForm: React.FC<AttributeFormProps> = ({ onSave, loading, initialValues }) => {
  const { t } = useTranslation(['attribute', 'translation']);
  const { form, handleSubmit } = useAttributeForm({ initialValues, onSave });

  const isEdit = !!initialValues;

  return (
    <div className="attribute-form-container">
      <Form
        form={form}
        layout="vertical"
        disabled={loading}
        onFinish={handleSubmit}
        scrollToFirstError
      >
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
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={8}>
            <Form.Item name="status" label={t('form.status')}>
              <Select size="large">
                <Select.Option value={true}>{t('status.active')}</Select.Option>
                <Select.Option value={false}>{t('status.inactive')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={8}>
            <Form.Item name="isMultiple" label={t('form.isMultiple')} valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={12} md={8}>
            <Form.Item name="overridePrice" label={t('form.overridePrice')} valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <FormActions>
          <AppButton onClick={() => window.history.back()}>
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
