import React, { useMemo, memo } from 'react';
import { Tag, Space, Flex, Typography, ConfigProvider, Switch } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/common/AppTable';
import { AppButton } from '@/components/common/AppButton';
import { SEO } from '@/components/common/SEO/SEO';
import { useRoleList } from '../hooks/useRoleList';
import type { Role } from '../data/role.types';
import { PermissionGate } from '@/components/common/PermissionGate/PermissionGate';

const { Text } = Typography;

const RoleList: React.FC = () => {
  const {
    roles,
    total,
    isLoading,
    isFetching,
    isReady,
    t,
    handleSwitchStatus,
    handleDelete,
    goToRoleCreate,
    goToRoleEdit,
  } = useRoleList();

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
        render: (name: string, record: Role) => (
          <Flex align="center" gap={8}>
            <Text 
              strong 
              onClick={() => goToRoleEdit(record._id)}
              className="clickable-code"
            >
              {name}
            </Text>
            {record.isAdmin && (
              <Tag color="gold" style={{ borderRadius: '4px', fontSize: '10px', lineHeight: '20px' }}>
                ADMIN
              </Tag>
            )}
          </Flex>
        ),
      },
      {
        title: t('columns.description'),
        dataIndex: 'description',
        key: 'description',
        render: (desc: string) => <Text type="secondary" className="text-sm">{desc || '-'}</Text>,
      },
      {
        title: t('fields.permissions'),
        key: 'permissions_count',
        align: 'center' as const,
        width: 150,
        render: (_: any, record: Role) => (
          <Tag 
            color="blue" 
            className="card-title-tag tag-blue"
          >
            {record.permissions?.length || 0} {t('permissions', { ns: 'translation' })}
          </Tag>
        ),
      },
      {
        title: t('columns.status'),
        dataIndex: 'status',
        key: 'status',
        align: 'center' as const,
        width: 100,
        render: (status: number, record: Role) => (
          <Switch
            checked={status === 1}
            size="small"
            onChange={() => handleSwitchStatus(record._id, status)}
            disabled={record.isAdmin}
          />
        ),
      },
      {
        title: t('columns.action'),
        key: 'action',
        align: 'right' as const,
        width: 150,
        render: (_: any, record: Role) => (
          <Space size="small">
            <PermissionGate module="role" action="update">
              <AppButton type="link" onClick={() => goToRoleEdit(record._id)}>
                {t('common.actions.edit', { ns: 'translation' })}
              </AppButton>
            </PermissionGate>
            <PermissionGate module="role" action="delete">
              <AppButton 
                danger 
                type="link" 
                onClick={() => handleDelete(record._id)}
                disabled={record.isAdmin}
              >
                {t('common.actions.delete', { ns: 'translation' })}
              </AppButton>
            </PermissionGate>
          </Space>
        ),
      },
    ],
    [t, goToRoleEdit, handleSwitchStatus, handleDelete]
  );

  return (
    <div className="role-list-page">
      <SEO title={t('roleList')} />
      
      <AppCard
        title={
          <Flex align="center" gap={8}>
            <TeamOutlined style={{ color: 'var(--primary-color)' }} />
            <span>{t('roleList')}</span>
            <Tag className="card-title-tag">
              {total}
            </Tag>
          </Flex>
        }
        extra={
          <PermissionGate module="role" action="create">
            <AppButton type="primary" onClick={goToRoleCreate}>
              {t('addRole')}
            </AppButton>
          </PermissionGate>
        }
        className="role-card"
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
              className="role-table"
              columns={columns}
              dataSource={roles}
              rowKey="_id"
              loading={isFetching}
              showSkeleton={!isReady || (isLoading && roles.length === 0)}
              skeletonRows={10}
              pagination={{
                pageSize: 20,
                showSizeChanger: false,
                size: 'small',
              }}
              onRow={(record: Role) => ({
                onClick: (e) => {
                  if ((e.target as HTMLElement).closest('.ant-switch, .ant-btn, .ant-checkbox-wrapper')) return;
                  goToRoleEdit(record._id);
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

export default memo(RoleList);
