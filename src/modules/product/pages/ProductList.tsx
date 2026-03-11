import { Space, Image, Badge } from 'antd';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/common/AppTable';
import { SEO } from '@/components/common/SEO/SEO';
import { AppLoader } from '@/components/common/AppLoader/AppLoader';
import { useProductList } from '@/modules/product/hooks/useProductList';
import type { Product } from '@/modules/product/data/product.types';
import { formatCurrency } from '@/utils/format';

import '../styles/product.less';

const ProductList = () => {
  const { t } = useTranslation(['product', 'translation']);
  const { data, isLoading, handleDelete, handleEdit } = useProductList();

  if (isLoading) return <AppLoader />;

  const columns = [
    {
      title: t('columns.image'),
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (thumbnail: any) => (
        <Image
          src={thumbnail?.thumbnail?.path || '/placeholder-product.png'}
          alt="product"
          width={50}
          height={50}
          style={{ objectFit: 'cover', borderRadius: '4px' }}
        />
      ),
    },
    { title: t('columns.name'), dataIndex: 'name', key: 'name' },
    { title: t('columns.code'), dataIndex: 'code', key: 'code' },
    { 
      title: t('columns.category'), 
      dataIndex: ['category', 'name'], 
      key: 'category' 
    },
    { 
      title: t('columns.price'), 
      dataIndex: 'priceSale', 
      key: 'price',
      render: (price: number) => formatCurrency(price)
    },
    {
      title: t('columns.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Badge 
          status={status === 1 ? 'success' : 'default'} 
          text={status === 1 ? t('status.active') : t('status.inactive')} 
        />
      )
    },
    {
      title: t('columns.action'),
      key: 'action',
      render: (_: unknown, record: Product) => (
        <Space size="middle">
          <AppButton type="link" onClick={() => handleEdit(record._id)}>
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
        extra={<AppButton type="primary">{t('addProduct')}</AppButton>}
        className="product-card"
      >
        <AppTable 
          className="product-table" 
          columns={columns} 
          dataSource={data} 
          rowKey="_id"
          pagination={{ pageSize: 10 }} 
        />
      </AppCard>
    </div>
  );
};

export default ProductList;
