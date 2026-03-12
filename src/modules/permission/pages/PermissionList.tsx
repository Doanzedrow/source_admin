import React, { useMemo } from 'react';
import { Tag, Space, Button, Typography } from 'antd';
import { PlusOutlined, EditOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/common/AppTable';
import { usePermissionList } from '../hooks/usePermissionList';
import type { Permission } from '../data/permission.types';

const { Text } = Typography;

const PermissionList: React.FC = () => {
  const {
    permissions,
    isLoading,
    isFetching,
    t,
    goToPermissionCreate,
    goToPermissionEdit,
  } = usePermissionList();

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
        title: t('columns.name', { ns: 'permission', defaultValue: 'Tên phân quyền' }),
        dataIndex: 'name',
        key: 'name',
        render: (name: string) => <Text strong>{name}</Text>,
      },
      {
        title: t('columns.module', { ns: 'permission', defaultValue: 'Module' }),
        dataIndex: 'module',
        key: 'module',
        render: (module: string) => <Tag color="blue">{module}</Tag>,
      },
      {
        title: t('columns.actions', { ns: 'permission', defaultValue: 'Hành động' }),
        key: 'actions_config',
        render: (_: any, record: Permission) => (
          <Space size="middle">
            <Tag color={record.actions.view ? 'success' : 'default'}>VIEW</Tag>
            <Tag color={record.actions.create ? 'success' : 'default'}>CREATE</Tag>
            <Tag color={record.actions.update ? 'success' : 'default'}>UPDATE</Tag>
            <Tag color={record.actions.delete ? 'success' : 'default'}>DELETE</Tag>
          </Space>
        ),
      },
      {
        title: t('columns.status', { ns: 'permission', defaultValue: 'Trạng thái' }),
        dataIndex: 'status',
        key: 'status',
        render: (status: number) => (
          <Tag color={status === 1 ? 'success' : 'error'}>
            {status === 1 ? t('common.active', { ns: 'translation' }) : t('common.inactive', { ns: 'translation' })}
          </Tag>
        ),
      },
      {
        title: '',
        key: 'actions',
        width: 100,
        align: 'center' as const,
        render: (_: any, record: Permission) => (
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => goToPermissionEdit(record._id)}
          />
        ),
      },
    ],
    [t, goToPermissionEdit]
  );

  return (
    <div className="page-content">
      <AppCard
        title={
          <Space>
            <SafetyCertificateOutlined />
            <span>{t('permissionList', { ns: 'permission', defaultValue: 'Danh sách phân quyền' })}</span>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={goToPermissionCreate}
          >
            {t('common.add', { ns: 'translation' })}
          </Button>
        }
      >
        <AppTable
          columns={columns}
          dataSource={permissions}
          rowKey="_id"
          loading={isLoading || isFetching}
          pagination={false}
        />
      </AppCard>
    </div>
  );
};

export default PermissionList;
