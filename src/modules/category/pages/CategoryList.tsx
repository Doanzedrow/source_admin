import { useMemo, memo } from 'react';
import { Space, Tag, Switch, Typography, Col, Flex, Upload } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/common/AppTable';
import { SEO } from '@/components/common/SEO/SEO';
import { useCategoryList } from '../hooks/useCategoryList';
import type { Category } from '../data/category.types';
import { AppFilter } from '@/components/common/AppFilter/AppFilter';
import { AppSearchInput } from '@/components/common/AppInput/AppSearchInput';
import { PermissionGate } from '@/components/common/PermissionGate/PermissionGate';
import { usePermission } from '@/hooks/usePermission';
import { BranchSelect } from '@/components/common/AppSelect/BranchSelect';

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
    handleBranchChange,
    handleExport,
    handleImport,
    total,
    t,
    rowSelection,
    selectedIds,
    setSelectedIds,
    goToCategoryCreate,
    goToCategoryEdit,
  } = useCategoryList();

  const { isSuperAdmin } = usePermission();

  const columns = useMemo(() => {
    const base: any[] = [
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
    ];

    if (isSuperAdmin) {
      base.push({
        title: t('columns.branch', { defaultValue: 'Chi nhánh' }),
        dataIndex: ['branch', 'name'],
        key: 'branch',
        width: 200,
        render: (name: string, record: Category) => (
          <Flex vertical gap={0}>
            <Text strong>{name}</Text>
            <Text type="secondary" className="text-xs">{record.branch?.code}</Text>
          </Flex>
        )
      });
    }

    base.push(
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
    );

    return base;
  }, [t, switchingId, params.page, params.page_size, handleSwitchStatus, handleDelete, goToCategoryEdit, isSuperAdmin]);

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
          {isSuperAdmin && (
            <Col xs={24} sm={8} md={6} lg={6}>
              <BranchSelect 
                value={params.branchId}
                onChange={handleBranchChange}
                placeholder={t('filter.branch', { defaultValue: 'Tất cả chi nhánh' })}
              />
            </Col>
          )}
        </AppFilter>
      </div>

      <AppCard
        title={
          <Flex align="center" gap={8}>
            <span>{t('title')}</span>
            <Tag className="card-title-tag">
              {total}
            </Tag>
          </Flex>
        }
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
              <Upload
                accept=".xlsx, .xls"
                showUploadList={false}
                beforeUpload={(file) => {
                  handleImport(file);
                  return false;
                }}
              >
                <AppButton icon={<UploadOutlined />} loading={isLoading && !isFetching}>
                  {t('common.actions.import', { ns: 'translation' })}
                </AppButton>
              </Upload>
            </PermissionGate>
            <PermissionGate module="category" action="view">
              <AppButton 
                icon={<DownloadOutlined />} 
                onClick={handleExport} 
                loading={isLoading && !isFetching}
              >
                {t('common.actions.export', { ns: 'translation' })}
              </AppButton>
            </PermissionGate>
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
