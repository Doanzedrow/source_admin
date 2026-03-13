import React, { useMemo, memo } from 'react';
import { Tag, Space, Flex, Typography, ConfigProvider, Switch } from 'antd';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/common/AppTable';
import { AppButton } from '@/components/common/AppButton';
import { SEO } from '@/components/common/SEO/SEO';
import { usePermissionList } from '../hooks/usePermissionList';
import type { Permission } from '../data/permission.types';
import { PermissionGate } from '@/components/common/PermissionGate/PermissionGate';

const { Text } = Typography;

const PermissionList: React.FC = () => {
  const {
    permissions,
    total,
    isLoading,
    isFetching,
    isReady,
    t,
    handleSwitchStatus,
    handleDelete,
    goToPermissionCreate,
    goToPermissionEdit,
  } = usePermissionList();

  const columns = useMemo(
    () => [
      {
        title: t('columns.index', { defaultValue: '#' }),
        key: 'index',
        width: 60,
        align: 'center' as const,
        render: (_: any, __: any, index: number) => (
          <Text type="secondary">{index + 1}</Text>
        ),
      },
      {
        title: t('columns.name'),
        dataIndex: 'name',
        key: 'name',
        render: (name: string, record: Permission) => (
          <Text 
            strong 
            onClick={() => goToPermissionEdit(record._id)}
            className="clickable-code"
          >
            {name}
          </Text>
        ),
      },
      {
        title: t('columns.module'),
        dataIndex: 'module',
        key: 'module',
        width: 150,
        render: (module: string, record: Permission) => (
          <Tag 
            className="card-title-tag tag-blue"
            style={{ cursor: 'pointer' }} 
            onClick={() => goToPermissionEdit(record._id)}
          >
            {module}
          </Tag>
        ),
      },
      {
        title: t('columns.actions'),
        key: 'actions_config',
        width: 300,
        render: (_: any, record: Permission) => (
          <Space size="small" wrap>
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
        width: 100,
        render: (status: number, record: Permission) => (
          <Switch
            checked={status === 1}
            size="small"
            onChange={() => handleSwitchStatus(record._id, status)}
          />
        ),
      },
      {
        title: t('columns.action'),
        key: 'action',
        align: 'right' as const,
        width: 150,
        render: (_: any, record: Permission) => (
          <Space size="small">
            <PermissionGate module="permission" action="update">
              <AppButton type="link" onClick={() => goToPermissionEdit(record._id)}>
                {t('common.actions.edit', { ns: 'translation' })}
              </AppButton>
            </PermissionGate>
            <PermissionGate module="permission" action="delete">
              <AppButton danger type="link" onClick={() => handleDelete(record._id)}>
                {t('common.actions.delete', { ns: 'translation' })}
              </AppButton>
            </PermissionGate>
          </Space>
        ),
      },
    ],
    [t, goToPermissionEdit, handleSwitchStatus, handleDelete]
  );

  return (
    <div className="permission-list-page">
      <SEO title={t('permissionList')} />
      
      <AppCard
        title={
          <Flex align="center" gap={8}>
            <SafetyCertificateOutlined style={{ color: 'var(--primary-color)' }} />
            <span>{t('permissionList')}</span>
            <Tag className="card-title-tag">
              {total}
            </Tag>
          </Flex>
        }
        extra={
          <PermissionGate module="permission" action="create">
            <AppButton type="primary" onClick={goToPermissionCreate}>
              {t('addPermission')}
            </AppButton>
          </PermissionGate>
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
              loading={isFetching}
              showSkeleton={!isReady || (isLoading && permissions.length === 0)}
              skeletonRows={10}
              pagination={{
                pageSize: 20,
                showSizeChanger: false,
                size: 'small',
              }}
              onRow={(record: Permission) => ({
                onClick: (e) => {
                  if ((e.target as HTMLElement).closest('.ant-switch, .ant-btn, .ant-checkbox-wrapper')) return;
                  goToPermissionEdit(record._id);
                },
                style: { cursor: 'pointer' },
              })}
            />
          </ConfigProvider>
        </div>
      </AppCard>
    </div>
  );
};

export default memo(PermissionList);
