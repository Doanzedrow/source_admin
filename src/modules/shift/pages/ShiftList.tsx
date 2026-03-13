import { useMemo } from 'react';
import { Space, Flex, Tag, Typography, Col, Switch, Select } from 'antd';
import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/common/AppTable';
import { SEO } from '@/components/common/SEO/SEO';
import { useShiftList } from '../hooks/useShiftList';
import { AppFilter } from '@/components/common/AppFilter/AppFilter';
import { AppSearchInput } from '@/components/common/AppInput/AppSearchInput';
import { AppButton } from '@/components/common/AppButton';
import { PermissionGate } from '@/components/common/PermissionGate/PermissionGate';
import { usePermission } from '@/hooks/usePermission';
import { BranchSelect } from '@/components/common/AppSelect/BranchSelect';
import type { Shift } from '../data/shift.types';

const { Text } = Typography;

const ShiftList = () => {
  const {
    data,
    total,
    filters,
    isFetching,
    handlePageChange,
    handleSearch,
    handleStatusChange,
    handleBranchChange,
    handleDelete,
    handleSwitchStatus,
    refetch,
    resetFilters,
    rowSelection,
    goToShiftCreate,
    goToShiftEdit,
    t,
  } = useShiftList();
  
  const { isSuperAdmin } = usePermission();

  const columns = useMemo(() => {
    const base: any[] = [
      {
        title: t('columns.index'),
        key: 'index',
        width: 60,
        align: 'center' as const,
        render: (_: any, __: any, index: number) => {
          return <Text type="secondary">{index + 1}</Text>;
        },
      },
      {
        title: t('columns.name'),
        dataIndex: 'name',
        key: 'name',
        render: (name: string, record: Shift) => (
          <Text strong onClick={() => goToShiftEdit(record._id)} className="clickable-code">
            {name}
          </Text>
        ),
      },
      {
        title: t('columns.startTime'),
        dataIndex: 'startTime',
        key: 'startTime',
        align: 'center' as const,
      },
      {
        title: t('columns.endTime'),
        dataIndex: 'endTime',
        key: 'endTime',
        align: 'center' as const,
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
        width: 100,
        render: (status: number, record: Shift) => (
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
        render: (_: any, record: Shift) => (
          <Space size="small">
            <PermissionGate module="shift" action="update">
              <AppButton type="link" onClick={() => goToShiftEdit(record._id)}>
                {t('common.actions.edit', { ns: 'translation' })}
              </AppButton>
            </PermissionGate>
            <PermissionGate module="shift" action="delete">
              <AppButton danger type="link" onClick={() => handleDelete(record._id)}>
                {t('common.actions.delete', { ns: 'translation' })}
              </AppButton>
            </PermissionGate>
          </Space>
        ),
      }
    );

    return base;
  }, [t, isSuperAdmin, goToShiftEdit, handleSwitchStatus, handleDelete]);

  return (
    <div className="shift-list-wrapper">
      <SEO title={t('title')} />

      <div className="sticky-filter">
        <AppFilter 
          onReset={resetFilters} 
          onRefresh={refetch}
          isLoading={isFetching}
        >
          <Col xs={24} sm={12} md={12}>
            <AppSearchInput
              placeholder={t('filter.keyword')}
              onSearch={handleSearch}
              defaultValue={filters.keyword}
            />
          </Col>
          
          <Col xs={12} sm={6} md={6}>
            <Select
              allowClear
              style={{ width: '100%' }}
              placeholder={t('filter.status')}
              options={[
                { label: t('status.active'), value: 1 },
                { label: t('status.inactive'), value: 0 },
              ]}
              value={filters.status}
              onChange={handleStatusChange}
            />
          </Col>

          {isSuperAdmin && (
            <Col xs={12} sm={6} md={6}>
              <BranchSelect 
                value={filters.branchId}
                onChange={handleBranchChange}
                placeholder={t('columns.branch')}
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
          <PermissionGate module="shift" action="create">
            <AppButton type="primary" onClick={goToShiftCreate}>
              {t('addShift')}
            </AppButton>
          </PermissionGate>
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

export default ShiftList;
