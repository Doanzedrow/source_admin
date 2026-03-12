import React, { useMemo } from 'react';
import { Space, Typography, Modal, Form, Switch } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, TagsOutlined } from '@ant-design/icons';
import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/common/AppInput';
import { AppTable } from '@/components/common/AppTable';
import { AppCard } from '@/components/common/AppCard';
import { useVariantManager } from '../hooks/useVariantManager';
import type { AttributeVariant } from '../data/attribute.types';
import { formatDate } from '@/utils/format';

const { Text } = Typography;

interface VariantManagerProps {
  attributeId: string;
}

export const VariantManager: React.FC<VariantManagerProps> = ({ attributeId }) => {
  const {
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
    variants,
    total,
    handleOpenModal,
    handleSave,
    handleDelete,
    handleSwitchStatus,
    handlePageChange,
  } = useVariantManager({ attributeId });

  const columns = useMemo(() => [
    {
      title: '#',
      key: 'index',
      width: 60,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => (
        <Text type="secondary">{(params.page - 1) * params.page_size + index + 1}</Text>
      ),
    },
    {
      title: t('form.variantCode'),
      dataIndex: 'code',
      key: 'code',
      width: 200,
      render: (code: string, record: AttributeVariant) => (
        <Text
          strong
          onClick={() => handleOpenModal(record)}
          className="clickable-code"
        >
          {code}
        </Text>
      ),
    },
    {
      title: t('form.variantName'),
      dataIndex: 'name',
      key: 'name',
      width: 300,
      render: (name: string) => <Text>{name}</Text>,
    },
    {
      title: t('form.status'),
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      width: 120,
      render: (status: number, record: AttributeVariant) => (
        <Switch 
          size="small" 
          checked={status === 1} 
          onChange={() => handleSwitchStatus(record._id)}
          loading={isSwitching}
        />
      ),
    },
    {
      title: t('columns.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => <Text type="secondary">{formatDate(date)}</Text>,
    },
    {
      title: t('columns.action'),
      key: 'action',
      align: 'right' as const,
      width: 150,
      render: (_: any, record: AttributeVariant) => (
        <Space size="middle">
          <AppButton 
            type="text" 
            icon={<EditOutlined style={{ fontSize: '16px' }} />} 
            onClick={() => handleOpenModal(record)} 
          />
          <AppButton 
            danger 
            type="text" 
            icon={<DeleteOutlined style={{ fontSize: '16px' }} />} 
            onClick={() => handleDelete(record._id)} 
            loading={isDeleting} 
          />
        </Space>
      ),
    },
  ], [t, isDeleting, isSwitching, params, handleOpenModal, handleDelete, handleSwitchStatus]);

  return (
    <div className="variant-manager-section">
      <AppCard
        title={
          <Space>
            <TagsOutlined style={{ color: 'var(--primary-color)' }} />
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
      >
        <AppTable
          columns={columns}
          dataSource={variants}
          rowKey="_id"
          loading={isFetching}
          pagination={{
            total,
            current: params.page,
            pageSize: params.page_size,
            onChange: handlePageChange,
            showSizeChanger: true,
          }}
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
            name="code"
            label={t('form.variantCode')}
            placeholder={t('form.variantCode')}
            rules={[{ required: true, message: t('validation.required', { field: t('form.variantCode') }) }]}
          />
          <AppInput
            name="name"
            label={t('form.variantName')}
            placeholder={t('form.variantName')}
            rules={[{ required: true, message: t('validation.required', { field: t('form.variantName') }) }]}
          />
        </Form>
      </Modal>
    </div>
  );
};
