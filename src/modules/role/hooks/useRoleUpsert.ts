import { useEffect } from 'react';
import { Form } from 'antd';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  useGetRoleByIdQuery, 
  useAddRoleMutation, 
  useEditRoleMutation 
} from '../api/roleApi';
import { useGetPermissionListQuery } from '../../permission/api/permissionApi';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import { useAppNotify } from '@/hooks/useAppNotify';

export const useRoleUpsert = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const [form] = Form.useForm();
  const { t } = useTranslation(['role', 'translation']);
  const { goToRoleList } = useAppNavigate();
  const { notification } = useAppNotify();

  const { data: roleData, isLoading: isFetchingRole } = useGetRoleByIdQuery(id!, {
    skip: !isEdit,
  });

  const { data: permissionsData, isLoading: isFetchingPermissions } = useGetPermissionListQuery();

  const [addRole, { isLoading: isAdding }] = useAddRoleMutation();
  const [editRole, { isLoading: isEditing }] = useEditRoleMutation();

  useEffect(() => {
    if (isEdit && roleData?.result) {
      const role = roleData.result;
      form.setFieldsValue({
        name: role.name,
        description: role.description,
        status: role.status,
        permissions: role.permissions?.map(p => p._id) || [],
      });
    } else {
      form.setFieldsValue({
        status: 1,
        permissions: [],
      });
    }
  }, [id, roleData, form, isEdit]);

  const onFinish = async (values: any) => {
    try {
      // Map permission IDs back to objects if necessary, but usually API accepts IDs
      const payload = {
        ...values,
        permissions: values.permissions, // Assumes API expects array of permission IDs
      };

      if (isEdit) {
        await editRole({ id: id!, body: payload }).unwrap();
      } else {
        await addRole(payload).unwrap();
      }

      notification.success({
        title: t('common.messages.success', { ns: 'translation' }),
        description: isEdit ? t('messages.updateSuccess') : t('messages.createSuccess'),
      });
      goToRoleList();
    } catch (error: any) {
      notification.error({
        title: t('common.messages.error', { ns: 'translation' }),
        description: error?.data?.message || t('common.messages.errorOccurred', { ns: 'translation' }),
      });
    }
  };

  return {
    form,
    isEdit,
    isLoading: isAdding || isEditing,
    isFetching: isFetchingRole || isFetchingPermissions,
    permissions: permissionsData?.result || [],
    t,
    onFinish,
    goToRoleList,
  };
};
