import React from 'react';
import { Form, Row, Col, Radio, TimePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
import { AppInput } from '@/components/common/AppInput/AppInput';
import { AppButton } from '@/components/common/AppButton';
import { FormActions } from '@/components/common/FormActions/FormActions';
import { BranchSelect } from '@/components/common/AppSelect/BranchSelect';
import { useShiftForm } from '../hooks/useShiftForm';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import { usePermission } from '@/hooks/usePermission';
import type { Shift } from '../data/shift.types';

interface ShiftFormProps {
  onSave: (values: any) => void;
  loading: boolean;
  initialValues: Shift | null;
  isEdit?: boolean;
}

const format = 'HH:mm';

export const ShiftForm: React.FC<ShiftFormProps> = ({
  onSave,
  loading: externalLoading,
  initialValues,
  isEdit = false,
}) => {
  const { form, onFinish, loading, t } = useShiftForm({
    initialValues,
    onSave,
    isEdit,
  });

  const { goToShiftList } = useAppNavigate() as any;
  const { isSuperAdmin } = usePermission();

  return (
    <div className="shift-form-container">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={loading || externalLoading}
        scrollToFirstError
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <AppInput
              label={t('form.name')}
              name="name"
              placeholder={t('form.name')}
              rules={[
                {
                  required: true,
                  message: t('common.validation.required', {
                    ns: 'translation',
                    field: t('form.name'),
                  }),
                },
              ]}
            />
          </Col>
          <Col xs={24} md={12}>
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

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label={t('form.startTime')}
              name="startTime"
              rules={[
                {
                  required: true,
                  message: t('common.validation.required', {
                    ns: 'translation',
                    field: t('form.startTime'),
                  }),
                },
              ]}
            >
              <TimePicker 
                format={format} 
                size="large" 
                style={{ width: '100%' }} 
                minuteStep={15}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label={t('form.endTime')}
              name="endTime"
              rules={[
                {
                  required: true,
                  message: t('common.validation.required', {
                    ns: 'translation',
                    field: t('form.endTime'),
                  }),
                },
              ]}
            >
              <TimePicker 
                format={format} 
                size="large" 
                style={{ width: '100%' }} 
                minuteStep={15}
              />
            </Form.Item>
          </Col>
        </Row>

        {isSuperAdmin && (
          <Row gutter={24}>
            <Col xs={24} md={24}>
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
          </Row>
        )}

        <FormActions>
          <AppButton onClick={goToShiftList}>
            {t('common.actions.cancel', { ns: 'translation' })}
          </AppButton>
          <AppButton type="primary" htmlType="submit" loading={loading || externalLoading}>
            {isEdit ? t('common.actions.save', { ns: 'translation' }) : t('common.actions.create', { ns: 'translation' })}
          </AppButton>
        </FormActions>
      </Form>
    </div>
  );
};
