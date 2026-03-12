import { useMemo, memo } from 'react';
import { Space, Flex, Tag, Switch, Select, Typography, Col } from 'antd';
import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/common/AppTable';
import { SEO } from '@/components/common/SEO/SEO';
import { useProductList } from '@/modules/product/hooks/useProductList';
import { AppFilter } from '@/components/common/AppFilter/AppFilter';
import { AppSearchInput } from '@/components/common/AppInput/AppSearchInput';
import { AppLoader } from '@/components/common/AppLoader/AppLoader';
import { AppButton } from '@/components/common/AppButton';
import { CachedImage } from '@/components/common/CachedImage/CachedImage';
import { formatCurrency } from '@/utils/format';
import { getFullImageUrl } from '@/store/api/uploadApi';
import { APP_ASSETS } from '@/config/assets';
import type { Product } from '../data/product.types';

import '../styles/product.less';

const { Text } = Typography;

const ProductList = () => {
  const {
    data,
    isLoading,
    isFetching,
    isReady,
    isPending,
    switchingId,
    handleDelete,
    handleBatchDelete,
    handleBatchUpdateStatus,
    handleSwitchStatus,
    handlePageChange,
    handleSearch,
    handleCategoryChange,
    handleStatusChange,
    params,
    resetFilters,
    total,
    t,
    rowSelection,
    selectedIds,
    setSelectedIds,
    categoryOptions,
    statusOptions,
    localCategory,
    localStatus,
    goToProductCreate,
    goToProductEdit,
  } = useProductList();

  const columns = useMemo(
    () => [
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
        width: 160,
        render: (code: string, record: Product) => (
          <Text
            strong
            onClick={() => goToProductEdit(record._id)}
            className="clickable-code"
          >
            {code}
          </Text>
        ),
      },
      {
        title: t('columns.name'),
        key: 'product',
        width: 300,
        render: (_: any, record: Product) => {
          const imagePath = record.thumbnail?.thumbnail?.path;
          const imageUrl = getFullImageUrl(imagePath) || APP_ASSETS.PRODUCT_PLACEHOLDER;

          return (
            <Flex gap={12} align="center">
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '1px solid var(--border-color-split)',
                  flexShrink: 0,
                }}
              >
                <CachedImage
                  src={imageUrl}
                  alt={record.name}
                  width={48}
                  height={48}
                  style={{ objectFit: 'scale-down' }}
                  isApiImage={false}
                />
              </div>
              <Flex vertical>
                <Text strong style={{ fontSize: '14px' }}>
                  {record.name}
                </Text>
              </Flex>
            </Flex>
          );
        },
      },
      {
        title: t('columns.category'),
        dataIndex: ['category', 'name'],
        key: 'category',
        width: 150,
      },
      {
        title: t('columns.price'),
        dataIndex: 'priceSale',
        key: 'priceSale',
        align: 'right' as const,
        render: (price: number) => <Text>{formatCurrency(price)}</Text>,
      },
      {
        title: t('columns.tax'),
        dataIndex: 'taxPercentage',
        key: 'taxPercentage',
        align: 'center' as const,
        render: (tax: number) => <Text>{tax}%</Text>,
      },
      {
        title: t('columns.totalPrice'),
        dataIndex: 'priceSaleWithTax',
        key: 'priceSaleWithTax',
        align: 'right' as const,
        render: (price: number) => (
          <Text strong type="success">
            {formatCurrency(price)}
          </Text>
        ),
      },
      {
        title: t('columns.stock'),
        dataIndex: 'stockCount',
        key: 'stock',
        align: 'center' as const,
        render: (count: number) => (
          <Tag
            color={count > 10 ? 'success' : 'error'}
            style={{
              margin: 0,
              borderRadius: '12px',
              padding: '0 12px',
              fontWeight: 'bold',
              minWidth: '45px',
              textAlign: 'center',
            }}
          >
            {count}
          </Tag>
        ),
      },
      {
        title: t('columns.status'),
        dataIndex: 'status',
        key: 'status',
        align: 'center' as const,
        render: (status: number, record: Product) => (
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
        render: (_: unknown, record: Product) => (
          <Space size="small">
            <AppButton type="link" onClick={() => goToProductEdit(record._id)}>
              {t('common.actions.edit', { ns: 'translation' })}
            </AppButton>
            <AppButton danger type="link" onClick={() => handleDelete(record._id)}>
              {t('common.actions.delete', { ns: 'translation' })}
            </AppButton>
          </Space>
        ),
      },
    ],
    [
      t,
      switchingId,
      goToProductEdit,
      handleDelete,
      handleSwitchStatus,
      params.page,
      params.page_size,
    ]
  );

  return (
    <div className="product-list-wrapper">
      <SEO title={t('seoTitle')} description={t('seoDescription')} />

      <div className="sticky-filter">
        <AppFilter onReset={resetFilters} isLoading={isFetching && data.length > 0}>
          <Col xs={24} sm={12} md={10} lg={10}>
            <AppSearchInput
              placeholder={t('filter.keyword')}
              value={params.keyword}
              debounceTime={300}
              onSearch={handleSearch}
            />
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <Select
              style={{ width: '100%' }}
              placeholder={t('filter.category')}
              value={localCategory}
              onChange={handleCategoryChange}
              allowClear
              options={categoryOptions}
              loading={isPending}
            />
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <Select
              style={{ width: '100%' }}
              placeholder={t('filter.status')}
              value={localStatus}
              onChange={handleStatusChange}
              allowClear
              options={statusOptions}
              loading={isPending}
            />
          </Col>
        </AppFilter>
      </div>

      <AppCard
        title={t('title')}
        extra={
          <Space>
            {selectedIds.length > 0 && (
              <>
                <AppButton
                  onClick={() => handleBatchUpdateStatus(selectedIds, 1, () => setSelectedIds([]))}
                  loading={isLoading}
                >
                  {t('status.active')}
                </AppButton>
                <AppButton
                  onClick={() => handleBatchUpdateStatus(selectedIds, 0, () => setSelectedIds([]))}
                  loading={isLoading}
                >
                  {t('status.inactive')}
                </AppButton>
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
              </>
            )}
            <AppButton type="primary" onClick={goToProductCreate}>
              {t('addProduct')}
            </AppButton>
          </Space>
        }
        className="product-card"
      >
        <div style={{ position: 'relative', minHeight: '400px' }}>
          {isReady && (
            <AppTable
              className="product-table"
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

export default memo(ProductList);
