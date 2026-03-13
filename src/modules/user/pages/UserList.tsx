import { useMemo } from 'react';
import { Space, Flex, Tag, Select, Typography, Col } from 'antd';
import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/common/AppTable';
import { SEO } from '@/components/common/SEO/SEO';
import { useUserList } from '../hooks/useUserList';
import { AppFilter } from '@/components/common/AppFilter/AppFilter';
import { AppSearchInput } from '@/components/common/AppInput/AppSearchInput';
import { AppButton } from '@/components/common/AppButton';
import { PermissionGate } from '@/components/common/PermissionGate/PermissionGate';
import { usePermission } from '@/hooks/usePermission';
import { BranchSelect } from '@/components/common/AppSelect/BranchSelect';
import { RoleSelect } from '@/components/common/AppSelect/RoleSelect';
import type { User } from '../data/user.types';

const { Text } = Typography;

const UserList = () => {
  const {
    data,
    total,
    filters,
    isLoading,
    isFetching,
    handlePageChange,
    handleSearch,
    handleStatusChange,
    handleBranchChange,
    handleRoleChange,
    handleDelete,
    handleBatchDelete,
    refetch,
    resetFilters,
    rowSelection,
    selectedIds,
    setSelectedIds,
    goToUserCreate,
    goToUserEdit,
    t,
  } = useUserList();
  
  const { isSuperAdmin } = usePermission();

  const statusOptions = useMemo(() => [
    { label: t('status.active'), value: 1 },
    { label: t('status.inactive'), value: 0 },
  ], [t]);

  const columns = useMemo(() => {
    const base: any[] = [
      {
        title: t('columns.index'),
        key: 'index',
        width: 60,
        align: 'center' as const,
        render: (_: any, __: any, index: number) => {
          const rowNumber = (filters.page - 1) * filters.page_size + index + 1;
          return <Text type="secondary">{rowNumber}</Text>;
        },
      },
      {
        title: t('columns.userName'),
        dataIndex: 'userName',
        key: 'userName',
        render: (name: string, record: User) => (
          <Text strong onClick={() => goToUserEdit(record._id)} className="clickable-code">
            {name}
          </Text>
        ),
      },
      {
        title: t('columns.fullname'),
        dataIndex: 'fullname',
        key: 'fullname',
      },
      {
        title: t('columns.email'),
        dataIndex: 'emailAddress',
        key: 'email',
        render: (email: string) => email || '-',
      },
      {
        title: t('columns.phone'),
        dataIndex: 'phone',
        key: 'phone',
        render: (phone: string) => phone || '-',
      },
      {
        title: t('columns.role'),
        dataIndex: ['role', 'name'],
        key: 'role',
        render: (roleName: string, record: User) => {
          const role = typeof record.role === 'object' ? record.role?.name : roleName;
          return (
            <Tag color="blue" variant="filled" style={{ borderRadius: '12px' }}>
              {role || t('common.none', { ns: 'translation' })}
            </Tag>
          );
        },
      },
    ];

    if (isSuperAdmin) {
      base.push({
        title: t('columns.branch'),
        dataIndex: ['branch', 'name'],
        key: 'branch',
        render: (name: string) => name || '-',
      });
    }

    base.push(
      {
        title: t('columns.status'),
        dataIndex: 'status',
        key: 'status',
        align: 'center' as const,
        render: (status: number) => (
          <Tag
            color={status === 1 ? 'success' : 'default'}
            variant="filled"
            style={{ borderRadius: '12px' }}
          >
            {status === 1 ? t('status.active') : t('status.inactive')}
          </Tag>
        ),
      },
      {
        title: t('columns.action'),
        key: 'action',
        align: 'right' as const,
        render: (_: any, record: User) => (
          <Space size="small">
            <PermissionGate module="user" action="update">
              <AppButton type="link" onClick={() => goToUserEdit(record._id)}>
                {t('common.actions.edit', { ns: 'translation' })}
              </AppButton>
            </PermissionGate>
            <PermissionGate module="user" action="delete">
              <AppButton danger type="link" onClick={() => handleDelete(record._id)}>
                {t('common.actions.delete', { ns: 'translation' })}
              </AppButton>
            </PermissionGate>
          </Space>
        ),
      }
    );

    return base;
  }, [t, filters.page, filters.page_size, goToUserEdit, handleDelete, isSuperAdmin]);

  return (
    <div className="user-list-wrapper">
      <SEO title={t('title')} />

      <div className="sticky-filter">
        <AppFilter 
          onReset={resetFilters} 
          onRefresh={refetch}
          isLoading={isFetching}
        >
          <Col xs={24} sm={12} md={8}>
            <AppSearchInput
              placeholder={t('filter.keyword')}
              onSearch={handleSearch}
              defaultValue={filters.keyword}
            />
          </Col>
          
          <Col xs={12} sm={6} md={4}>
            <Select
              allowClear
              style={{ width: '100%' }}
              placeholder={t('filter.status')}
              options={statusOptions}
              value={filters.status}
              onChange={handleStatusChange}
            />
          </Col>

          <Col xs={12} sm={6} md={4}>
            <RoleSelect 
                value={filters.roleId}
                onChange={handleRoleChange}
                placeholder={t('filter.role')}
            />
          </Col>

          {isSuperAdmin && (
            <Col xs={12} sm={6} md={4}>
              <BranchSelect 
                value={filters.branchId}
                onChange={handleBranchChange}
                placeholder={t('filter.branch')}
              />
            </Col>
          )}
        </AppFilter>
      </div>

      <AppCard
        title={
          <Flex align="center" gap={8}>
            <span>{t('title')}</span>
            <Tag className="card-title-tag">{total}</Tag>
          </Flex>
        }
        extra={
          <Space>
            {selectedIds.length > 0 && (
              <PermissionGate module="user" action="delete">
                <AppButton
                  danger
                  onClick={() => handleBatchDelete(selectedIds, () => setSelectedIds([]))}
                  loading={isLoading}
                >
                  {t('common.actions.deleteSelected', { ns: 'translation', count: selectedIds.length })}
                </AppButton>
              </PermissionGate>
            )}
            <PermissionGate module="user" action="create">
              <AppButton type="primary" onClick={goToUserCreate}>
                {t('addUser')}
              </AppButton>
            </PermissionGate>
          </Space>
        }
      >
        <AppTable
          columns={columns}
          dataSource={data}
          rowKey="_id"
          pagination={{
            total,
            current: filters.page,
            pageSize: filters.page_size,
            onChange: handlePageChange,
            showSizeChanger: true,
          }}
          loading={isFetching}
          rowSelection={rowSelection}
        />
      </AppCard>
    </div>
  );
};

export default UserList;
