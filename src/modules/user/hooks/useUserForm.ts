import  { useEffect } from 'react';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import type { User } from '../data/user.types';

interface UseUserFormProps {
  initialValues: User | null;
  onSave: (values: any) => void;
  isEdit?: boolean;
}

export const useUserForm = ({ initialValues, onSave }: UseUserFormProps) => {
  const { t } = useTranslation(['user', 'translation']);
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        role: typeof initialValues.role === 'object' ? (initialValues.role as any)?._id : initialValues.role,
        branch: typeof initialValues.branch === 'object' ? (initialValues.branch as any)?._id : initialValues.branch,
        birthday: initialValues.birthday ? dayjs(initialValues.birthday) : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const onFinish = (values: any) => {
    const submitValues = {
      ...values,
      birthday: values.birthday ? dayjs(values.birthday).format('YYYY-MM-DD') : '',
    };
    onSave(submitValues);
  };

  return {
    form,
    onFinish,
    t,
  };
};
