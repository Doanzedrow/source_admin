import React, { useState, useMemo } from 'react';
import { Space, Typography, Tag, Modal, Form } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, TagsOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/common/AppInput';
import { AppTable } from '@/components/common/AppTable';
import { AppCard } from '@/components/common/AppCard';
import { useAppNotify } from '@/hooks/useAppNotify';
import { useAppConfirm } from '@/hooks/useAppConfirm';
import { useCreateVariantMutation, useUpdateVariantMutation, useDeleteVariantMutation } from '../api/variantApi';
import type { AttributeVariant } from '../data/attribute.types';

const { Text } = Typography;

interface VariantManagerProps {
  attributeId: string;
  variants: AttributeVariant[];
}

export const VariantManager: React.FC<VariantManagerProps> = ({ attributeId, variants = [] }) => {
  const { t } = useTranslation(['attribute', 'translation']);
  const { notification } = useAppNotify();
  const { confirmDelete } = useAppConfirm();
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<AttributeVariant | null>(null);

  const [createVariant, { isLoading: isCreating }] = useCreateVariantMutation();
  const [updateVariant, { isLoading: isUpdating }] = useUpdateVariantMutation();
  const [deleteVariant, { isLoading: isDeleting }] = useDeleteVariantMutation();

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
        await updateVariant({ id: editingVariant._id, body: values }).unwrap();
        notification.success({ message: t('messages.updateSuccess') });
      } else {
        await createVariant({ ...values, attribute: attributeId, status: 1 }).unwrap();
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
          await deleteVariant(id).unwrap();
          notification.success({ message: t('messages.deleteSuccess') });
        } catch (error: any) {
          notification.error({ message: t('messages.deleteError') });
        }
      },
    });
  };

  const columns = useMemo(() => [
    {
      title: '#',
      key: 'index',
      width: 60,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: t('form.variantName'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: t('form.variantCode'),
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <Tag>{code}</Tag>,
    },
    {
      title: t('columns.action'),
      key: 'action',
      align: 'right' as const,
      width: 120,
      render: (_: any, record: AttributeVariant) => (
        <Space size="small">
          <AppButton 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleOpenModal(record)} 
          />
          <AppButton 
            danger 
            type="text" 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record._id)} 
            loading={isDeleting} 
          />
        </Space>
      ),
    },
  ], [t, isDeleting]);

  return (
    <div className="variant-manager-section">
      <AppCard
        title={
          <Space>
            <TagsOutlined />
            <span>{t('form.variants')}</span>
          </Space>
        }
        extra={
          <AppButton 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => handleOpenModal()}
          >
            {t('form.addVariant')}
          </AppButton>
        }
        className="variant-manager-card"
        style={{ border: '1px solid var(--border-color-split)' }}
      >
        <AppTable
          columns={columns}
          dataSource={variants}
          rowKey="_id"
          pagination={false}
          size="small"
        />
      </AppCard>

      <Modal
        title={editingVariant ? t('titleEdit') : t('form.addVariant')}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isCreating || isUpdating}
        okText={t('common.actions.save', { ns: 'translation' })}
        cancelText={t('common.actions.cancel', { ns: 'translation' })}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" style={{ marginTop: '20px' }}>
          <AppInput
            name="name"
            label={t('form.variantName')}
            placeholder={t('form.variantName')}
            rules={[{ required: true, message: t('validation.required', { field: t('form.variantName') }) }]}
          />
          <AppInput
            name="code"
            label={t('form.variantCode')}
            placeholder={t('form.variantCode')}
            rules={[{ required: true, message: t('validation.required', { field: t('form.variantCode') }) }]}
          />
        </Form>
      </Modal>
    </div>
  );
};
