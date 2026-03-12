import { useMemo, memo } from 'react';
import { Space, Tag, Typography, Col, Flex } from 'antd';
import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/common/AppTable';
import { SEO } from '@/components/common/SEO/SEO';
import { useAttributeList } from '../hooks/useAttributeList';
import { AppFilter } from '@/components/common/AppFilter/AppFilter';
import { AppSearchInput } from '@/components/common/AppInput/AppSearchInput';
import { AppLoader } from '@/components/common/AppLoader/AppLoader';
import type { Attribute } from '../data/attribute.types';

import '../styles/attribute.less';

const { Text } = Typography;

const AttributeList = () => {
  const {
    data,
    isLoading,
    isFetching,
    isReady,
    handleDelete,
    handleBatchDelete,
    params,
    handlePageChange,
    handleSearch,
    resetFilters,
    total,
    t,
    rowSelection,
    selectedIds,
    setSelectedIds,
    goToAttributeCreate,
    goToAttributeEdit,
  } = useAttributeList();

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
      render: (code: string, record: Attribute) => (
        <Text
          strong
          onClick={() => goToAttributeEdit(record._id)}
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
    },
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
          <Tag color="orange" variant="filled">{t('common.yes', { ns: 'translation' })}</Tag>
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
        <Tag color={status === 1 ? 'success' : 'default'} variant="filled" style={{ borderRadius: '12px' }}>
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
          <AppButton type="link" onClick={() => goToAttributeEdit(record._id)}>
            {t('common.actions.edit', { ns: 'translation' })}
          </AppButton>
          <AppButton danger type="link" onClick={() => handleDelete(record._id)}>
            {t('common.actions.delete', { ns: 'translation' })}
          </AppButton>
        </Space>
      ),
    },
  ], [t, params.page, params.page_size, handleDelete, goToAttributeEdit]);

  return (
    <div className="attribute-list-wrapper">
      <SEO title={t('title')} />

      <AppFilter onReset={resetFilters} isLoading={isFetching && data.length > 0}>
        <Col xs={24} md={12}>
          <AppSearchInput
            placeholder={t('filter.keyword')}
            value={params.keyword}
            debounceTime={300}
            onSearch={handleSearch}
          />
        </Col>
      </AppFilter>

      <AppCard
        title={t('title')}
        extra={
          <Space>
            {selectedIds.length > 0 && (
              <AppButton
                danger
                onClick={() => handleBatchDelete(selectedIds, () => setSelectedIds([]))}
                loading={isLoading}
              >
                {t('common.actions.deleteSelected', { ns: 'translation', count: selectedIds.length })}
              </AppButton>
            )}
            <AppButton type="primary" onClick={goToAttributeCreate}>
              {t('titleCreate')}
            </AppButton>
          </Space>
        }
      >
        <div style={{ position: 'relative', minHeight: '400px' }}>
          {isReady && (
            <AppTable
              columns={columns}
              dataSource={data}
              rowKey="_id"
              loading={isFetching && data.length > 0}
              pagination={{
                total,
                current: params.page,
                pageSize: params.page_size,
                onChange: handlePageChange,
              }}
              rowSelection={rowSelection}
            />
          )}

          <AppLoader
            isLoading={!isReady || (isLoading && data.length === 0)}
            overlay
            description={t('loading', { ns: 'translation' })}
          />
        </div>
      </AppCard>
    </div>
  );
};

export default memo(AttributeList);
