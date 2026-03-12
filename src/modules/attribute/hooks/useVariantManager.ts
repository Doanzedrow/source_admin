import { useState } from 'react';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAppNotify } from '@/hooks/useAppNotify';
import { useAppConfirm } from '@/hooks/useAppConfirm';
import { 
  useCreateVariantMutation, 
  useUpdateVariantMutation, 
  useDeleteVariantMutation,
  useSwitchVariantStatusMutation,
  useGetVariantListQuery
} from '../api/variantApi';
import type { AttributeVariant } from '../data/attribute.types';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';

interface UseVariantManagerProps {
  attributeId: string;
}

export const useVariantManager = ({ attributeId }: UseVariantManagerProps) => {
  const { t } = useTranslation(['attribute', 'translation']);
  const { notification } = useAppNotify();
  const { confirmDelete } = useAppConfirm();
  const [form] = Form.useForm();

  const [params, setParams] = useState({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
    attribute: attributeId,
  });

  const { data: response, isFetching, isLoading: isListLoading } = useGetVariantListQuery(params);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<AttributeVariant | null>(null);

  const [createVariant, { isLoading: isCreating }] = useCreateVariantMutation();
  const [updateVariant, { isLoading: isUpdating }] = useUpdateVariantMutation();
  const [deleteVariant, { isLoading: isDeleting }] = useDeleteVariantMutation();
  const [switchStatus, { isLoading: isSwitching }] = useSwitchVariantStatusMutation();

  const handleOpenModal = (variant?: AttributeVariant) => {
    if (variant) {
      setEditingVariant(variant);
      form.setFieldsValue({
        name: variant.name,
        code: variant.code,
      });
    } else {
      setEditingVariant(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingVariant) {
        await updateVariant({ 
          id: editingVariant._id, 
          attributeId, 
          body: values 
        }).unwrap();
        notification.success({ message: t('messages.updateSuccess') });
      } else {
        await createVariant({ 
          ...values, 
          attribute: attributeId, 
          status: 1 
        }).unwrap();
        notification.success({ message: t('messages.createSuccess') });
      }
      setIsModalOpen(false);
    } catch (error: any) {
      notification.error({
        message: t('common.messages.error', { ns: 'translation' }),
        description: error?.data?.message || error?.message,
      });
    }
  };

  const handleDelete = (id: string) => {
    confirmDelete({
      onOk: async () => {
        try {
          await deleteVariant({ id, attributeId }).unwrap();
          notification.success({ message: t('messages.deleteSuccess') });
        } catch (error: any) {
          notification.error({ message: t('messages.deleteError') });
        }
      },
    });
  };

  const handleSwitchStatus = async (id: string) => {
    try {
      await switchStatus({ id, attributeId }).unwrap();
      notification.success({ message: t('messages.updateSuccess') });
    } catch (error: any) {
      notification.error({
        message: t('common.messages.error', { ns: 'translation' }),
        description: error?.data?.message || error?.message,
      });
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setParams((prev) => ({ ...prev, page, page_size: pageSize }));
  };

  return {
    t,
    form,
    params,
    isModalOpen,
    setIsModalOpen,
    editingVariant,
    isCreating,
    isUpdating,
    isDeleting,
    isSwitching,
    isFetching,
    isListLoading,
    variants: response?.result?.data || [],
    total: response?.result?.total || 0,
    handleOpenModal,
    handleSave,
    handleDelete,
    handleSwitchStatus,
    handlePageChange,
  };
};
