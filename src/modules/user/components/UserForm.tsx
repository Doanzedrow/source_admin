import React from 'react';
import { Form, Row, Col, Radio } from 'antd';
import { AppInput } from '@/components/common/AppInput/AppInput';
import { AppButton } from '@/components/common/AppButton';
import { FormActions } from '@/components/common/FormActions/FormActions';
import { BranchSelect } from '@/components/common/AppSelect/BranchSelect';
import { RoleSelect } from '@/components/common/AppSelect/RoleSelect';
import { useUserForm } from '../hooks/useUserForm';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import { usePermission } from '@/hooks/usePermission';
import { AppBirthdayPicker } from '@/components/common/AppDatePicker/AppBirthdayPicker';
import type { User } from '../data/user.types';

interface UserFormProps {
  onSave: (values: any) => void;
  loading: boolean;
  initialValues: User | null;
  isEdit?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  onSave,
  loading,
  initialValues,
  isEdit = false,
}) => {
  const { form, onFinish, t } = useUserForm({
    initialValues,
    onSave,
    isEdit,
  });

  const { goToUserList } = useAppNavigate() as any;
  const { isSuperAdmin } = usePermission();

  return (
    <div className="user-form-container">
      <Form
        form={form}
        layout="vertical"
        disabled={loading}
        onFinish={onFinish}
        initialValues={{ status: 1, gender: 1 }}
        scrollToFirstError
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <AppInput
              label={t('form.userName')}
              name="userName"
              placeholder={t('form.userName')}
              rules={[
                {
                  required: true,
                  message: t('common.validation.required', {
                    ns: 'translation',
                    field: t('form.userName'),
                  }),
                },
              ]}
              disabled={isEdit}
            />
          </Col>
          <Col xs={24} md={12}>
            <AppInput
              label={t('form.fullname')}
              name="fullname"
              placeholder={t('form.fullname')}
              rules={[
                {
                  required: true,
                  message: t('common.validation.required', {
                    ns: 'translation',
                    field: t('form.fullname'),
                  }),
                },
              ]}
            />
          </Col>
        </Row>

        {!isEdit && (
          <Row gutter={24}>
            <Col xs={24} md={24}>
              <AppInput
                label={t('form.password')}
                name="password"
                type="password"
                placeholder={t('form.password')}
                rules={[
                  {
                    required: true,
                    message: t('common.validation.required', {
                      ns: 'translation',
                      field: t('form.password'),
                    }),
                  },
                ]}
              />
            </Col>
          </Row>
        )}

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <AppInput
              label={t('form.emailAddress')}
              name="emailAddress"
              placeholder={t('form.emailAddress')}
              rules={[
                {
                  type: 'email',
                  message: t('common.validation.email', { ns: 'translation' }),
                },
              ]}
            />
          </Col>
          <Col xs={24} md={12}>
            <AppInput
              label={t('form.phone')}
              name="phone"
              placeholder={t('form.phone')}
            />
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={isSuperAdmin ? 12 : 24}>
            <Form.Item
              label={t('form.role')}
              name="role"
              rules={[
                {
                  required: true,
                  message: t('common.validation.required', {
                    ns: 'translation',
                    field: t('form.role'),
                  }),
                },
              ]}
            >
              <RoleSelect placeholder={t('form.role')} size="large" />
            </Form.Item>
          </Col>
          {isSuperAdmin && (
            <Col xs={24} md={12}>
              <Form.Item
                label={t('form.branch')}
                name="branch"
                rules={[
                  {
                    required: true,
                    message: t('common.validation.required', {
                      ns: 'translation',
                      field: t('form.branch'),
                    }),
                  },
                ]}
              >
                <BranchSelect placeholder={t('form.branch')} size="large" />
              </Form.Item>
            </Col>
          )}
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item label={t('form.birthday')} name="birthday">
              <AppBirthdayPicker size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label={t('form.gender')} name="gender">
                  <Radio.Group
                    optionType="button"
                    buttonStyle="solid"
                    size="large"
                    style={{ width: '100%', display: 'flex' }}
                  >
                    <Radio value={1} style={{ flex: 1, textAlign: 'center' }}>
                      {t('gender.male')}
                    </Radio>
                    <Radio value={2} style={{ flex: 1, textAlign: 'center' }}>
                      {t('gender.female')}
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={t('form.status')} name="status">
                  <Radio.Group
                    optionType="button"
                    buttonStyle="solid"
                    size="large"
                    style={{ width: '100%', display: 'flex' }}
                  >
                    <Radio value={1} style={{ flex: 1, textAlign: 'center' }}>
                      {t('status.active')}
                    </Radio>
                    <Radio value={0} style={{ flex: 1, textAlign: 'center' }}>
                      {t('status.inactive')}
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={24}>
            <Form.Item label={t('form.address')} name="address">
              <AppInput placeholder={t('form.address')} />
            </Form.Item>
          </Col>
        </Row>

        <FormActions>
          <AppButton onClick={goToUserList}>
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
