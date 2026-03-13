import { useEffect } from 'react';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useAppNotify } from '@/hooks/useAppNotify';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import { useAddShiftMutation, useEditShiftMutation } from '../api/shiftApi';
import type { Shift } from '../data/shift.types';

interface UseShiftFormProps {
  initialValues: Shift | null;
  onSave: (values: any) => void;
  isEdit?: boolean;
}

export const useShiftForm = ({ initialValues, onSave, isEdit }: UseShiftFormProps) => {
  const [form] = Form.useForm();
  const { t } = useTranslation(['shift', 'common', 'translation']);
  const { notification } = useAppNotify();
  const { goToShiftList } = useAppNavigate() as any;

  const [addShift, { isLoading: isAdding }] = useAddShiftMutation();
  const [editShift, { isLoading: isEditing }] = useEditShiftMutation();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        startTime: initialValues.startTime ? dayjs(initialValues.startTime, 'HH:mm') : null,
        endTime: initialValues.endTime ? dayjs(initialValues.endTime, 'HH:mm') : null,
      });
    } else {
      form.setFieldsValue({
        status: 1,
      });
    }
  }, [initialValues, form]);

  const onFinish = async (values: any) => {
    try {
      const formattedValues = {
        ...values,
        startTime: values.startTime ? dayjs(values.startTime).format('HH:mm') : '',
        endTime: values.endTime ? dayjs(values.endTime).format('HH:mm') : '',
      };

      if (isEdit && initialValues) {
        await editShift({ id: initialValues._id, body: formattedValues }).unwrap();
        notification.success({
          title: t('common.messages.success', { ns: 'translation' }),
          description: t('messages.updateSuccess'),
        });
      } else {
        await addShift(formattedValues).unwrap();
        notification.success({
          title: t('common.messages.success', { ns: 'translation' }),
          description: t('messages.createSuccess'),
        });
      }
      onSave(formattedValues);
      goToShiftList();
    } catch (error: any) {
      notification.error({
        title: t('common.messages.error', { ns: 'translation' }),
        description: error?.data?.message || (isEdit ? t('messages.updateError') : t('messages.createError')),
      });
    }
  };

  return {
    form,
    onFinish,
    loading: isAdding || isEditing,
    t,
  };
};
