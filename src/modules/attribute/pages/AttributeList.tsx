import { useMemo, memo } from 'react';
import { Space, Tag, Typography, Col, Flex, Upload } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/common/AppTable';
import { SEO } from '@/components/common/SEO/SEO';
import { useAttributeList } from '../hooks/useAttributeList';
import { AppFilter } from '@/components/common/AppFilter/AppFilter';
import { AppSearchInput } from '@/components/common/AppInput/AppSearchInput';
import { PermissionGate } from '@/components/common/PermissionGate/PermissionGate';
import { usePermission } from '@/hooks/usePermission';
import { BranchSelect } from '@/components/common/AppSelect/BranchSelect';
import type { Attribute } from '../data/attribute.types';

import '../styles/attribute.less';

const { Text } = Typography;

const AttributeList = () => {
  const {
    data,
    refetch,
    isLoading,
    isFetching,
    isReady,
    handleDelete,
    handleBatchDelete,
    params,
    handlePageChange,
    handleSearch,
    handleBranchChange,
    handleExport,
    handleImport,
    resetFilters,
    total,
    t,
    rowSelection,
    selectedIds,
    setSelectedIds,
    goToAttributeCreate,
    goToAttributeEdit,
  } = useAttributeList();

  const { isSuperAdmin } = usePermission();

  const columns = useMemo(
    () => {
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
          render: (code: string, record: Attribute) => (
            <Text strong onClick={() => goToAttributeEdit(record._id)} className="clickable-code">
              {code}
            </Text>
          ),
        },
        {
          title: t('columns.name'),
          dataIndex: 'name',
          key: 'name',
        },
      ];

      if (isSuperAdmin) {
        base.push({
          title: t('columns.branch', { defaultValue: 'Chi nhánh' }),
          dataIndex: ['branch', 'name'],
          key: 'branch',
          width: 200,
          render: (name: string, record: Attribute) => (
            <Flex vertical>
              <Text strong>{name}</Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>{record.branch?.code}</Text>
            </Flex>
          )
        });
      }

      base.push(
        {
          title: t('columns.isMultiple'),
          dataIndex: 'isMultiple',
          key: 'isMultiple',
          align: 'center' as const,
          render: (val: boolean, record: Attribute) =>
            val ? (
              <Flex vertical gap={2} align="center">
                <Tag color="blue" variant="filled" style={{ width: 'fit-content' }}>
                  {t('common.yes', { ns: 'translation' })}
                </Tag>
                {record.maxSelect > 0 && (
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    {t('columns.maxSelect')}: {record.maxSelect}
                  </Text>
                )}
              </Flex>
            ) : (
              <Text type="secondary">-</Text>
            ),
        },
        {
          title: t('columns.variants'),
          dataIndex: 'variants',
          key: 'variants',
          align: 'center' as const,
          render: (variants: any[]) => (
            <Tag color="purple" variant="filled" style={{ borderRadius: '12px' }}>
              {(variants || []).length}
            </Tag>
          ),
        },
        {
          title: t('columns.overridePrice'),
          dataIndex: 'overridePrice',
          key: 'overridePrice',
          align: 'center' as const,
          render: (val: boolean) =>
            val ? (
              <Tag color="orange" variant="filled">
                {t('common.yes', { ns: 'translation' })}
              </Tag>
            ) : (
              <Text type="secondary">-</Text>
            ),
        },
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
          render: (_: unknown, record: Attribute) => (
            <Space size="small">
              <PermissionGate module="attribute" action="update">
                <AppButton type="link" onClick={() => goToAttributeEdit(record._id)}>
                  {t('common.actions.edit', { ns: 'translation' })}
                </AppButton>
              </PermissionGate>
              <PermissionGate module="attribute" action="delete">
                <AppButton danger type="link" onClick={() => handleDelete(record._id)}>
                  {t('common.actions.delete', { ns: 'translation' })}
                </AppButton>
              </PermissionGate>
            </Space>
          ),
        }
      );

      return base;
    },
    [t, params.page, params.page_size, handleDelete, goToAttributeEdit, isSuperAdmin]
  );

  return (
    <div className="attribute-list-wrapper">
      <SEO title={t('title')} />

      <div className="sticky-filter">
        <AppFilter 
          onReset={resetFilters} 
          onRefresh={refetch}
          isLoading={isFetching}
        >
          <Col xs={24} md={12}>
            <AppSearchInput
              placeholder={t('filter.keyword')}
              value={params.keyword}
              debounceTime={300}
              onSearch={handleSearch}
            />
          </Col>
          {isSuperAdmin && (
            <Col xs={24} md={6}>
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
        title={t('title')}
        extra={
          <Space>
            {selectedIds.length > 0 && (
              <PermissionGate module="attribute" action="delete">
                <AppButton
                  danger
                  onClick={() => handleBatchDelete(selectedIds, () => setSelectedIds([]))}
                  loading={isLoading}
                >
                  {t('common.actions.deleteSelected', {
                    ns: 'translation',
                    count: selectedIds.length,
                  })}
                </AppButton>
              </PermissionGate>
            )}
            <PermissionGate module="attribute" action="create">
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
            <PermissionGate module="attribute" action="view">
              <AppButton 
                icon={<DownloadOutlined />} 
                onClick={handleExport} 
                loading={isLoading && !isFetching}
              >
                {t('common.actions.export', { ns: 'translation' })}
              </AppButton>
            </PermissionGate>
            <PermissionGate module="attribute" action="create">
              <AppButton type="primary" onClick={goToAttributeCreate}>
                {t('titleCreate')}
              </AppButton>
            </PermissionGate>
          </Space>
        }
      >
        <div style={{ position: 'relative', minHeight: '400px' }}>
          <AppTable
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

export default memo(AttributeList);
