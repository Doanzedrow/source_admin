import React from 'react';
import { Form, Select, Row, Col, Switch, Input } from 'antd';
import { AppCard } from '@/components/common/AppCard';
import { AppInput } from '@/components/common/AppInput/AppInput';
import { AppButton } from '@/components/common/AppButton';
import { FormActions } from '@/components/common/FormActions/FormActions';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { useCategoryForm } from '../hooks/useCategoryForm';
import { useNavigate } from 'react-router-dom';
import { rc, RouteKey } from '@/routes/routeConfig';

interface CategoryFormProps {
  isEdit?: boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ isEdit = false }) => {
  const { form, onFinish, handleValuesChange, isLoading, t } = useCategoryForm(isEdit);
  const navigate = useNavigate();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onValuesChange={handleValuesChange}
      initialValues={{ status: 1, type: 1 }}
    >
      <PageHeader 
        title={isEdit ? t('titleEdit') : t('titleCreate')} 
      />

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <AppCard>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <AppInput
                  label={t('form.name')}
                  name="name"
                  placeholder={t('placeholder.name')}
                  rules={[{ required: true, message: t('validation.required', { field: t('form.name') }) }]}
                />
              </Col>
              <Col xs={24} md={12}>
                <AppInput
                  label={t('form.code')}
                  name="code"
                  placeholder={t('placeholder.code')}
                  rules={[{ required: true, message: t('validation.required', { field: t('form.code') }) }]}
                />
              </Col>
            </Row>

            <AppInput
              label={t('form.slug')}
              name="slug"
              placeholder={t('placeholder.slug')}
              disabled
            />

            <Form.Item
              label={t('form.description')}
              name="description"
            >
              <Input.TextArea 
                rows={4} 
                placeholder={t('placeholder.description')} 
              />
            </Form.Item>
          </AppCard>
        </Col>

        <Col xs={24} lg={8}>
          <AppCard>
            <Form.Item
              label={t('form.type')}
              name="type"
              rules={[{ required: true, message: t('validation.required', { field: t('form.type') }) }]}
            >
              <Select
                options={[
                  { label: t('type.product'), value: 1 },
                  { label: t('type.service'), value: 2 },
                ]}
                placeholder={t('placeholder.type')}
              />
            </Form.Item>

            <Form.Item
              label={t('form.status')}
              name="status"
              valuePropName="checked"
              getValueProps={(value) => ({ checked: value === 1 })}
              getValueFromEvent={(checked) => (checked ? 1 : 0)}
            >
              <Switch checkedChildren={t('status.active')} unCheckedChildren={t('status.inactive')} />
            </Form.Item>
          </AppCard>
        </Col>
      </Row>

      <FormActions>
        <AppButton onClick={() => navigate(rc(RouteKey.Category).path)}>
          {t('common.actions.cancel', { ns: 'translation' })}
        </AppButton>
        <AppButton type="primary" htmlType="submit" loading={isLoading}>
          {isEdit ? t('common.actions.update', { ns: 'translation' }) : t('common.actions.create', { ns: 'translation' })}
        </AppButton>
      </FormActions>
    </Form>
  );
};
