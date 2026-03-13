import React, { memo } from 'react';
import { Form, Switch, Row, Col, Select } from 'antd';
import { SEO } from '@/components/common/SEO/SEO';
import { AppLoader } from '@/components/common/AppLoader/AppLoader';
import { AppBreadcrumb } from '@/components/common/AppBreadcrumb';
import { AppCard } from '@/components/common/AppCard';
import { AppInput } from '@/components/common/AppInput';
import { FormActions } from '@/components/common/FormActions';
import { AppButton } from '@/components/common/AppButton';
import { useRoleUpsert } from '../hooks/useRoleUpsert';
import { rc, RouteKey } from '@/routes/routeConfig';

const { Option } = Select;

const RoleUpsert: React.FC = () => {
  const {
    form,
    isEdit,
    isLoading,
    isFetching,
    permissions,
    t,
    onFinish,
    goToRoleList,
  } = useRoleUpsert();

  const title = isEdit ? t('editRole') : t('addRole');

  if (isFetching) return <AppLoader />;

  return (
    <div className="role-upsert-page">
      <SEO title={title} />

      <div className="upsert-header">
        <AppBreadcrumb
          items={[
            { title: t('roleList'), link: rc(RouteKey.Role).path },
            { title: title },
          ]}
          title={title}
          onBack={goToRoleList}
        />
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        scrollToFirstError
      >
        <AppCard className="form-container">
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <AppInput
                label={t('fields.name')}
                name="name"
                placeholder={t('placeholders.name')}
                rules={[
                  {
                    required: true,
                    message: t('validation.nameRequired'),
                  },
                ]}
              />
            </Col>
            <Col xs={24} md={12}>
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
            <Col xs={24}>
              <AppInput
                label={t('fields.description')}
                name="description"
                placeholder={t('placeholders.description')}
                isTextArea
                rows={3}
              />
            </Col>
          </Row>

          <div style={{ marginTop: '24px' }}>
            <Form.Item
              label={t('fields.permissions')}
              name="permissions"
            >
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder={t('fields.permissions')}
                optionFilterProp="children"
                showSearch
              >
                {permissions.map(p => (
                  <Option key={p._id} value={p._id}>
                    {p.name} ({p.module})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <FormActions style={{ marginTop: '32px' }}>
            <AppButton onClick={goToRoleList}>
              {t('common.actions.cancel', { ns: 'translation' })}
            </AppButton>
            <AppButton type="primary" htmlType="submit" loading={isLoading}>
              {isEdit
                ? t('common.actions.update', { ns: 'translation' })
                : t('common.actions.create', { ns: 'translation' })}
            </AppButton>
          </FormActions>
        </AppCard>
      </Form>
    </div>
  );
};

export default memo(RoleUpsert);
