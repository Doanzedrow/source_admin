import { useMemo, memo } from 'react';
import { Space, Tag, Switch, Typography, Col } from 'antd';
import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/common/AppTable';
import { SEO } from '@/components/common/SEO/SEO';
import { useCategoryList } from '../hooks/useCategoryList';
import type { Category } from '../data/category.types';
import { AppFilter } from '@/components/common/AppFilter/AppFilter';
import { AppSearchInput } from '@/components/common/AppInput/AppSearchInput';
import { PermissionGate } from '@/components/common/PermissionGate/PermissionGate';

import '../styles/category.less';

const { Text } = Typography;

const CategoryList = () => {
  const { 
    data, 
    refetch,
    isLoading, 
    isFetching,
    isReady,
    switchingId,
    handleDelete,
    handleBatchDelete,
    handleSwitchStatus,
    params, 
    resetFilters,
    handlePageChange, 
    handleSearch,
    total,
    t,
    rowSelection,
    selectedIds,
    setSelectedIds,
    goToCategoryCreate,
    goToCategoryEdit,
  } = useCategoryList();

  const columns = useMemo(() => [
    {
      title: t('columns.index'),
      key: 'index',
      width: 60,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => {
        const rowNumber = (params.page - 1) * params.page_size + index + 1;
        return <Text type="secondary">{rowNumber}</Text>;
      },
    },
    {
      title: t('columns.code'),
      dataIndex: 'code',
      key: 'code',
      width: 150,
      render: (code: string, record: Category) => (
        <Text 
          strong 
          onClick={() => goToCategoryEdit(record._id)}
          className="clickable-code"
        >
          {code}
        </Text>
      ),
    },
    {
      title: t('columns.name'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: t('columns.totalProduct'),
      dataIndex: 'totalProduct',
      key: 'totalProduct',
      align: 'center' as const,
      width: 120,
      render: (count: number) => (
        <Tag color="blue" variant="filled" style={{ borderRadius: '12px', padding: '0 12px' }}>
          {count || 0}
        </Tag>
      ),
    },
    {
      title: t('columns.type'),
      dataIndex: 'type',
      key: 'type',
      width: 130,
      render: (type: number) => (
        <Tag color={type === 1 ? 'orange' : 'cyan'} variant="filled">
          {type === 1 ? t('type.product') : t('type.service')}
        </Tag>
      ),
    },
    {
      title: t('columns.status'),
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      width: 100,
      render: (status: number, record: Category) => (
        <Switch 
          checked={status === 1} 
          onChange={() => handleSwitchStatus(record._id, status)}
          loading={switchingId === record._id}
          size="small"
        />
      ),
    },
    {
      title: t('columns.action'),
      key: 'action',
      align: 'right' as const,
      width: 150,
      render: (_: unknown, record: Category) => (
        <Space size="small">
          <PermissionGate module="category" action="update">
            <AppButton type="link" onClick={() => goToCategoryEdit(record._id)}>
              {t('common.actions.edit', { ns: 'translation' })}
            </AppButton>
          </PermissionGate>
          <PermissionGate module="category" action="delete">
            <AppButton danger type="link" onClick={() => handleDelete(record._id)}>
              {t('common.actions.delete', { ns: 'translation' })}
            </AppButton>
          </PermissionGate>
        </Space>
      ),
    },
  ], [t, switchingId, params.page, params.page_size, handleSwitchStatus, handleDelete, goToCategoryEdit]);

  return (
    <div className="category-list-wrapper">
      <SEO title={t('seoTitle')} description={t('seoDescription')} />
      
      <div className="sticky-filter">
        <AppFilter 
          onReset={resetFilters} 
          onRefresh={refetch}
          isLoading={isFetching}
        >
          <Col xs={24} sm={16} md={12} lg={12}>
            <AppSearchInput
              placeholder={t('filter.keyword')}
              value={params.keyword}
              debounceTime={300}
              onSearch={handleSearch}
            />
          </Col>
        </AppFilter>
      </div>

      <AppCard
        title={t('title')}
        extra={
          <Space>
            {selectedIds.length > 0 && (
              <PermissionGate module="category" action="delete">
                <AppButton
                  danger
                  onClick={() => handleBatchDelete(selectedIds, () => setSelectedIds([]))}
                  loading={isLoading}
                >
                  {t('common.actions.deleteSelected', { ns: 'translation', count: selectedIds.length })}
                </AppButton>
              </PermissionGate>
            )}
            <PermissionGate module="category" action="create">
              <AppButton type="primary" onClick={goToCategoryCreate}>
                {t('addCategory')}
              </AppButton>
            </PermissionGate>
          </Space>
        }
      >
        <div style={{ position: 'relative', minHeight: '400px' }}>
          <AppTable
            className="category-table"
            columns={columns}
            dataSource={data}
            rowKey="_id"
            showSkeleton={!isReady || (isLoading && data.length === 0)}
            skeletonRows={8}
            loading={isFetching}
            pagination={{
              total,
              current: params.page,
              pageSize: params.page_size,
              onChange: handlePageChange,
            }}
            rowSelection={rowSelection}
          />
        </div>
      </AppCard>
    </div>
  );
};

export default memo(CategoryList);
