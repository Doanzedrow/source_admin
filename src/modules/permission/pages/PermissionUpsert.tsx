import React, { useEffect, memo } from 'react';
import { Form, Checkbox, Switch, Row, Col, Divider, Typography } from 'antd';

import { SEO } from '@/components/common/SEO/SEO';
import { AppLoader } from '@/components/common/AppLoader/AppLoader';
import { AppBreadcrumb } from '@/components/common/AppBreadcrumb';
import { AppCard } from '@/components/common/AppCard';
import { AppInput } from '@/components/common/AppInput';
import { FormActions } from '@/components/common/FormActions';
import { AppButton } from '@/components/common/AppButton';
import { usePermissionUpsert } from '../hooks/usePermissionUpsert';
import { rc, RouteKey } from '@/routes/routeConfig';

const { Text } = Typography;

const PermissionUpsert: React.FC = () => {
  const {
    id,
    t,
    goToPermissionList,
    currentPermission,
    loading,
    isDetailLoading,
    handleSave,
  } = usePermissionUpsert();

  const [form] = Form.useForm();
  const isEdit = !!id;
  const title = isEdit ? t('editPermission') : t('addPermission');

  useEffect(() => {
    if (currentPermission) {
      form.setFieldsValue(currentPermission);
    }
  }, [currentPermission, form]);

  if (id && isDetailLoading) return <AppLoader />;

  return (
    <div className="permission-upsert-page">
      <SEO title={title} />

      <div className="upsert-header">
        <AppBreadcrumb
          items={[
            { title: t('permissionList'), link: rc(RouteKey.Permission).path },
            { title: title },
          ]}
          title={title}
          onBack={goToPermissionList}
          id={id}
        />
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        requiredMark={false}
        scrollToFirstError
        initialValues={{
          status: 1,
          actions: {
            view: false,
            create: false,
            update: false,
            delete: false,
          },
        }}
      >
        <div 
          className="permission-upsert-main-container"
          style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          <AppCard
            className="form-container"
            title={t('sections.info', { defaultValue: 'Thông tin phân quyền' })}
          >
            <Row gutter={24}>
              <Col xs={24} md={8}>
                <AppInput
                  label={t('fields.name')}
                  name="name"
                  placeholder={t('placeholders.name')}
                  rules={[{ required: true, message: t('validation.required', { field: t('fields.name') }) }]}
                />
              </Col>
              <Col xs={24} md={8}>
                <AppInput
                  label={t('fields.module')}
                  name="module"
                  placeholder={t('placeholders.module')}
                  rules={[{ required: true, message: t('validation.required', { field: t('fields.module') }) }]}
                />
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label={t('fields.status')}
                  name="status"
                  valuePropName="checked"
                  getValueProps={(value) => ({ checked: value === 1 })}
                  getValueFromEvent={(checked) => (checked ? 1 : 0)}
                >
                  <Switch
                    checkedChildren={t('common.active', { ns: 'translation' })}
                    unCheckedChildren={t('common.inactive', { ns: 'translation' })}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left" style={{ marginTop: 0 }}>
              <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600 }}>
                {t('sections.actions').toUpperCase()}
              </Text>
            </Divider>

            <div style={{ 
              background: 'rgba(0,0,0,0.02)', 
              padding: '24px', 
              borderRadius: '12px',
              border: '1px dashed var(--border-color-split)'
            }}>
              <Row gutter={[16, 16]}>
                {['view', 'create', 'update', 'delete'].map((action) => (
                  <Col xs={12} sm={6} key={action}>
                    <Form.Item name={['actions', action]} valuePropName="checked" style={{ marginBottom: 0 }}>
                      <Checkbox style={{ fontWeight: 500 }}>
                        {action.toUpperCase()}
                      </Checkbox>
                    </Form.Item>
                  </Col>
                ))}
              </Row>
            </div>
          </AppCard>

          <FormActions isSticky={true} style={{ margin: 0 }}>
            <AppButton onClick={goToPermissionList} size="large">
              {t('common.actions.cancel', { ns: 'translation' })}
            </AppButton>
            <AppButton
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{ minWidth: 150 }}
            >
              {isEdit
                ? t('common.actions.update', { ns: 'translation' })
                : t('common.actions.create', { ns: 'translation' })}
            </AppButton>
          </FormActions>
        </div>
      </Form>
    </div>
  );
};

export default memo(PermissionUpsert);
