import { Space, Flex, Typography, Tag, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/common/AppTable';
import { CachedImage } from '@/components/common/CachedImage/CachedImage';
import { SEO } from '@/components/common/SEO/SEO';
import { useProductList } from '@/modules/product/hooks/useProductList';
import type { Product } from '@/modules/product/data/product.types';
import { formatCurrency } from '@/utils/format';
import { IMAGE_URL } from '@/config/constants';
import { useAppNavigate } from '@/hooks/useAppNavigate';

import '../styles/product.less';

const { Text } = Typography;

const ProductList = () => {
  const { t } = useTranslation(['product', 'translation']);
  const { goToProductCreate, goToProductEdit } = useAppNavigate();
  const { 
    data, 
    isLoading, 
    handleDelete, 
    handleSwitchStatus, 
    switchingId,
    params, 
    handlePageChange, 
    total 
  } = useProductList();

  const columns = [
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
      width: 120,
      render: (code: string) => <Text strong>{code}</Text>,
    },
    {
      title: t('columns.name'),
      key: 'product',
      width: 300,
      render: (_: any, record: Product) => {
        const imagePath = record.thumbnail?.thumbnail?.path;
        let imageUrl = '/placeholder-product.png';

        if (imagePath) {
          if (imagePath.startsWith('http')) {
            imageUrl = imagePath;
          } else {
            const baseUrl = IMAGE_URL.replace(/\/$/, '');
            const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
            imageUrl = `${baseUrl}${cleanPath}`;
          }
        }

        return (
          <Flex gap={12} align="center">
            <CachedImage
              src={imageUrl}
              alt={record.name}
              width={48}
              height={48}
              style={{ objectFit: 'cover', borderRadius: '4px' }}
              isApiImage={false}
            />
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
      render: (price: number) => <Text strong type="success">{formatCurrency(price)}</Text>,
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
  ];

  return (
    <div className="product-list-wrapper">
      <SEO title={t('seoTitle')} description={t('seoDescription')} />
      <AppCard
        title={t('title')}
        extra={<AppButton type="primary" onClick={goToProductCreate}>{t('addProduct')}</AppButton>}
        className="product-card"
      >
        <AppTable
          className="product-table"
          columns={columns}
          dataSource={data}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            total,
            current: params.page,
            pageSize: params.page_size,
            onChange: handlePageChange,
          }}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
          }}
        />
      </AppCard>
    </div>
  );
};

export default ProductList;
