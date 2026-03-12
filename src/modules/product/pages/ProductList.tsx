import { useMemo, memo } from 'react';
import { Space, Flex, Tag, Switch, Select, Typography, Col } from 'antd';
import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/common/AppTable';
import { SEO } from '@/components/common/SEO/SEO';
import { useProductList } from '@/modules/product/hooks/useProductList';
import { AppFilter } from '@/components/common/AppFilter/AppFilter';
import { AppSearchInput } from '@/components/common/AppInput/AppSearchInput';
import { AppButton } from '@/components/common/AppButton';
import { CachedImage } from '@/components/common/CachedImage/CachedImage';
import { formatCurrency } from '@/utils/format';
import { getFullImageUrl } from '@/store/api/uploadApi';
import { APP_ASSETS } from '@/config/assets';
import { PermissionGate } from '@/components/common/PermissionGate/PermissionGate';
import { usePermission } from '@/hooks/usePermission';
import type { Product } from '../data/product.types';

import '../styles/product.less';

const { Text } = Typography;

const ProductList = () => {
  const {
    data,
    refetch,
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
    totalProducts,
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
          width: 160,
          render: (code: string, record: Product) => (
            <Text strong onClick={() => goToProductEdit(record._id)} className="clickable-code">
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
      ];

      if (isSuperAdmin) {
        base.push({
          title: t('columns.branch', { defaultValue: 'Chi nhánh' }),
          dataIndex: ['branch', 'name'],
          key: 'branch',
          width: 200,
          render: (name: string, record: Product) => (
            <Flex vertical>
              <Text strong>{name}</Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>{record.branch?.code}</Text>
            </Flex>
          )
        });
      }

      base.push(
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
              variant="filled"
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
              <PermissionGate module="product" action="update">
                <AppButton type="link" onClick={() => goToProductEdit(record._id)}>
                  {t('common.actions.edit', { ns: 'translation' })}
                </AppButton>
              </PermissionGate>
              <PermissionGate module="product" action="delete">
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

    [
      t,
      switchingId,
      goToProductEdit,
      handleDelete,
      handleSwitchStatus,
      params.page,
      params.page_size,
      isSuperAdmin,
    ]
  );

  return (
    <div className="product-list-wrapper">
      <SEO title={t('seoTitle')} description={t('seoDescription')} />

      <div className="sticky-filter">
        <AppFilter 
          onReset={resetFilters} 
          onRefresh={refetch}
          isLoading={isFetching}
        >
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
        title={
          <Flex align="center" gap={8}>
            <span>{t('title')}</span>
            <Tag 
              color="blue" 
              style={{ 
                margin: 0, 
                borderRadius: '12px', 
                padding: '0 8px',
                backgroundColor: 'rgba(24, 144, 255, 0.1)',
                color: '#1890ff',
                border: 'none',
                fontWeight: 600
              }}
            >
              {totalProducts}
            </Tag>
          </Flex>
        }
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
                <PermissionGate module="product" action="delete">
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
              </>
            )}
            <PermissionGate module="product" action="create">
              <AppButton type="primary" onClick={goToProductCreate}>
                {t('addProduct')}
              </AppButton>
            </PermissionGate>
          </Space>
        }
        className="product-card"
      >
        <div style={{ position: 'relative', minHeight: '400px' }}>
          <AppTable
            className="product-table"
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

export default memo(ProductList);
