import { Form, Select, Row, Col, Input } from 'antd';
import { AppInput } from '@/components/common/AppInput/AppInput';
import { AppButton } from '@/components/common/AppButton';
import { FormActions } from '@/components/common/FormActions/FormActions';
import { useCategoryForm } from '../hooks/useCategoryForm';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import type { Category } from '../data/category.types';

interface CategoryFormProps {
  onSave: (values: any) => void;
  loading: boolean;
  initialValues: Category | null;
  isEdit?: boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ 
  onSave, 
  loading, 
  initialValues, 
  isEdit = false 
}) => {
  const { form, onFinish, handleValuesChange, t } = useCategoryForm({
    initialValues,
    onSave,
    isEdit
  });
  
  const { goToCategories } = useAppNavigate();

  return (
    <div className="category-form-container">
      <Form
        form={form}
        layout="vertical"
        disabled={loading}
        onFinish={onFinish}
        initialValues={{ status: 1, type: 1 }}
        onValuesChange={handleValuesChange}
        scrollToFirstError
      >
        <Row gutter={[24, 0]}>
          <Col xs={24} lg={16}>
            <Row gutter={24}>
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
          </Col>

          <Col xs={24} lg={8}>
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
                size="large"
              />
            </Form.Item>

            <Form.Item
              label={t('form.status')}
              name="status"
            >
              <Select size="large">
                <Select.Option value={1}>{t('status.active')}</Select.Option>
                <Select.Option value={0}>{t('status.inactive')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <FormActions>
          <AppButton onClick={goToCategories}>
            {t('common.actions.cancel', { ns: 'translation' })}
          </AppButton>
          <AppButton type="primary" htmlType="submit" loading={loading}>
            {isEdit ? t('common.actions.update', { ns: 'translation' }) : t('common.actions.create', { ns: 'translation' })}
          </AppButton>
        </FormActions>
      </Form>
    </div>
  );
};
