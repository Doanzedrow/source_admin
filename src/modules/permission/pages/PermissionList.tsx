import React, { useMemo, memo } from 'react';
import { Tag, Space, Flex, Typography, ConfigProvider } from 'antd';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/common/AppTable';
import { AppButton } from '@/components/common/AppButton';
import { usePermissionList } from '../hooks/usePermissionList';
import type { Permission } from '../data/permission.types';

const { Text } = Typography;

const PermissionList: React.FC = () => {
  const { permissions, total, isLoading, isFetching, t, goToPermissionCreate, goToPermissionEdit } =
    usePermissionList();

  const columns = useMemo(
    () => [
      {
        title: '#',
        key: 'index',
        width: 60,
        align: 'center' as const,
        render: (_: any, __: any, index: number) => index + 1,
      },
      {
        title: t('columns.name'),
        dataIndex: 'name',
        key: 'name',
        render: (name: string) => <Text strong>{name}</Text>,
      },
      {
        title: t('columns.module'),
        dataIndex: 'module',
        key: 'module',
        render: (module: string) => <Tag color="blue">{module}</Tag>,
      },
      {
        title: t('columns.actions'),
        key: 'actions_config',
        render: (_: any, record: Permission) => (
          <Space size="small">
            <Tag color={record.actions.view ? 'success' : 'default'} variant="filled">
              VIEW
            </Tag>
            <Tag color={record.actions.create ? 'success' : 'default'} variant="filled">
              CREATE
            </Tag>
            <Tag color={record.actions.update ? 'success' : 'default'} variant="filled">
              UPDATE
            </Tag>
            <Tag color={record.actions.delete ? 'success' : 'default'} variant="filled">
              DELETE
            </Tag>
          </Space>
        ),
      },
      {
        title: t('columns.status'),
        dataIndex: 'status',
        key: 'status',
        align: 'center' as const,
        render: (status: number) => (
          <Tag
            color={status === 1 ? 'success' : 'error'}
            variant="filled"
            style={{ minWidth: 80, textAlign: 'center' }}
          >
            {status === 1
              ? t('common.active', { ns: 'translation' })
              : t('common.inactive', { ns: 'translation' })}
          </Tag>
        ),
      },
      {
        title: t('columns.action'),
        key: 'action',
        align: 'right' as const,
        width: 120,
        render: (_: any, record: Permission) => (
          <Space size="small">
            <AppButton type="link" onClick={() => goToPermissionEdit(record._id)}>
              {t('common.actions.edit', { ns: 'translation' })}
            </AppButton>
          </Space>
        ),
      },
    ],
    [t, goToPermissionEdit]
  );

  return (
    <AppCard
      title={
        <Flex align="center" gap={8}>
          <SafetyCertificateOutlined style={{ color: 'var(--primary-color)' }} />
          <span>{t('permissionList')}</span>
          <Tag
            color="blue"
            style={{
              margin: 0,
              borderRadius: '12px',
              padding: '0 8px',
              backgroundColor: 'rgba(24, 144, 255, 0.1)',
              color: '#1890ff',
              border: 'none',
              fontWeight: 600,
            }}
          >
            {total}
          </Tag>
        </Flex>
      }
      extra={
        <AppButton type="primary"  onClick={goToPermissionCreate}>
          {t('addPermission')}
        </AppButton>
      }
      className="permission-card"
    >
      <div style={{ position: 'relative', minHeight: '400px' }}>
        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerBg: 'transparent',
                headerColor: 'var(--text-secondary)',
                headerBorderRadius: 8,
              },
            },
          }}
        >
          <AppTable
            className="permission-table"
            columns={columns}
            dataSource={permissions}
            rowKey="_id"
            loading={isLoading || isFetching}
            showSkeleton={isLoading && permissions.length === 0}
            pagination={{
              pageSize: 20,
              showSizeChanger: false,
              size: 'small',
            }}
          />
        </ConfigProvider>
      </div>
    </AppCard>
  );
};

export default memo(PermissionList);
