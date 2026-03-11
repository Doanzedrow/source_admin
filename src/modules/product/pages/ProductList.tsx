import React, { useMemo, useCallback, useState, memo, useEffect, useDeferredValue } from 'react';
import { Space, Flex, Tag, Switch, Select, Typography, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/common/AppTable';
import { CachedImage } from '@/components/common/CachedImage/CachedImage';
import { SEO } from '@/components/common/SEO/SEO';
import { useProductList } from '@/modules/product/hooks/useProductList';
import type { Product } from '@/modules/product/data/product.types';
import { formatCurrency } from '@/utils/format';
import { getFullImageUrl } from '@/store/api/uploadApi';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import { APP_ASSETS } from '@/config/assets';
import { AppFilter } from '@/components/common/AppFilter/AppFilter';
import { AppSearchInput } from '@/components/common/AppInput/AppSearchInput';
import { AppLoader } from '@/components/common/AppLoader/AppLoader';

import '../styles/product.less';

const { Text } = Typography;

const ProductList = () => {
  const { t } = useTranslation(['product', 'translation']);
  const { goToProductCreate, goToProductEdit } = useAppNavigate();
  const {
    data,
    isLoading,
    isFetching,
    handleDelete,
    handleBatchDelete,
    handleSwitchStatus,
    switchingId,
    params,
    setFilters,
    resetFilters,
    categories,
    handlePageChange,
    total,
  } = useProductList();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = useCallback(
    (val: string) => {
      setFilters({ keyword: val, page: 1 });
    },
    [setFilters]
  );

  const handleCategoryChange = useCallback(
    (val: string) => {
      setFilters({ category: val, page: 1 });
    },
    [setFilters]
  );

  const handleStatusChange = useCallback(
    (val: any) => {
      setFilters({ status: val, page: 1 });
    },
    [setFilters]
  );

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ label: c.name, value: c.code })),
    [categories]
  );

  const statusOptions = useMemo(
    () => [
      { label: t('status.active'), value: 1 },
      { label: t('status.inactive'), value: 0 },
    ],
    [t]
  );

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
            style={{
              cursor: 'pointer',
              color: 'inherit',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-color)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
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

  const rowSelection = useMemo(
    () => ({
      type: 'checkbox' as const,
      selectedRowKeys: selectedIds,
      onChange: (keys: React.Key[]) => setSelectedIds(keys as string[]),
      preserveSelectedRowKeys: true,
    }),
    [selectedIds]
  );

  const deferredData = useDeferredValue(data);

  return (
    <div className="product-list-wrapper">
      <SEO title={t('seoTitle')} description={t('seoDescription')} />

      <AppFilter onReset={resetFilters} isLoading={isFetching}>
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
            value={params.category}
            onChange={handleCategoryChange}
            allowClear
            options={categoryOptions}
          />
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
          <Select
            style={{ width: '100%' }}
            placeholder={t('filter.status')}
            value={params.status !== undefined ? Number(params.status) : undefined}
            onChange={handleStatusChange}
            allowClear
            options={statusOptions}
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
                {t('common.actions.deleteSelected', {
                  ns: 'translation',
                  count: selectedIds.length,
                })}
              </AppButton>
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
              dataSource={deferredData}
              rowKey="_id"
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
            isLoading={!isReady || (isLoading && data.length === 0) || (isFetching && data.length > 0)} 
            overlay 
            tip={!isReady || isLoading ? t('loading', { ns: 'translation' }) : undefined}
          />
        </div>
      </AppCard>
    </div>
  );
};

export default memo(ProductList);
