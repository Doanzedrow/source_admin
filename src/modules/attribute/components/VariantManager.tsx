import React, { useState } from 'react';
import { Space, Typography, Tag, Modal, Form } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, TagsOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/common/AppInput';
import { useAppNotify } from '@/hooks/useAppNotify';
import { useAppConfirm } from '@/hooks/useAppConfirm';
import { useCreateVariantMutation, useUpdateVariantMutation, useDeleteVariantMutation } from '../api/variantApi';
import type { AttributeVariant } from '../data/attribute.types';

const { Text } = Typography;

interface VariantManagerProps {
  attributeId: string;
  variants: AttributeVariant[];
  onRefresh?: () => void;
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

  return (
    <div className="variant-manager">
      <div className="form-section">
        <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <TagsOutlined /> {t('form.variants')}
          </Space>
          <AppButton type="primary" size="small" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
            {t('form.addVariant')}
          </AppButton>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
          {variants.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', background: 'var(--body-bg)', borderRadius: '8px', border: '1px dashed var(--border-color-split)' }}>
              <Text type="secondary">{t('common.messages.noData', { ns: 'translation' })}</Text>
            </div>
          ) : (
            variants.map((v) => (
              <div 
                key={v._id} 
                style={{ 
                  padding: '12px 16px', 
                  background: 'var(--body-bg)', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border-color-split)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <Text strong>{v.name}</Text>
                  <Tag style={{ marginLeft: '10px' }}>{v.code}</Tag>
                </div>
                <Space>
                  <AppButton type="text" icon={<EditOutlined />} onClick={() => handleOpenModal(v)} />
                  <AppButton danger type="text" icon={<DeleteOutlined />} onClick={() => handleDelete(v._id)} loading={isDeleting} />
                </Space>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        title={editingVariant ? t('titleEdit') : t('form.addVariant')}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isCreating || isUpdating}
        okText={t('common.actions.save', { ns: 'translation' })}
        cancelText={t('common.actions.cancel', { ns: 'translation' })}
        destroyOnClose
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
