import React from 'react';
import { Form, Select, Row, Col, Switch, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { AppInput } from '@/components/common/AppInput';
import { AppInputNumber } from '@/components/common/AppInputNumber';
import { REGEX } from '@/utils/regex';

const { Text, Paragraph } = Typography;

interface AttributeFormProps {
  form: any;
}

export const AttributeForm: React.FC<AttributeFormProps> = ({ form }) => {
  const { t } = useTranslation(['attribute', 'translation']);
  const isMultiple = Form.useWatch('isMultiple', form);

  return (
    <div className="attribute-form-content">
      <div className="form-section">
        <Row gutter={[24, 0]}>
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
            <Form.Item name="status" label={t('form.status')}>
              <Select size="large">
                <Select.Option value={1}>{t('status.active')}</Select.Option>
                <Select.Option value={0}>{t('status.inactive')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div className="form-section last-section">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <Form.Item name="isMultiple" valuePropName="checked" noStyle>
                <Switch style={{ marginTop: '4px' }} />
              </Form.Item>
              <div>
                <Text strong style={{ display: 'block' }}>
                  {t('form.isMultiple')}
                </Text>
                <Paragraph type="secondary" style={{ marginBottom: 0, fontSize: '13px' }}>
                  {t('form.isMultipleDesc')}
                </Paragraph>
              </div>
            </div>

            {isMultiple && (
              <div style={{ marginTop: '20px', paddingLeft: '52px' }}>
                <AppInputNumber
                  name="maxSelect"
                  label={t('form.maxSelect')}
                  rules={[{ required: true }]}
                  min={1}
                  style={{ width: '100%' }}
                />
              </div>
            )}
          </Col>

          <Col xs={24} md={12}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <Form.Item name="overridePrice" valuePropName="checked" noStyle>
                <Switch style={{ marginTop: '4px' }} />
              </Form.Item>
              <div>
                <Text strong style={{ display: 'block' }}>
                  {t('form.overridePrice')}
                </Text>
                <Paragraph type="secondary" style={{ marginBottom: 0, fontSize: '13px' }}>
                  {t('form.overridePriceDesc')}
                </Paragraph>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
