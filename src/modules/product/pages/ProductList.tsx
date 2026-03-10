import { Table, Space } from 'antd';
import { AppButton } from '@/components/common/AppButton';
import { useTranslation } from 'react-i18next';
import { SEO } from '@/components/common/SEO/SEO';
import { useProductList } from '@/modules/product/hooks/useProductList';
import type { ProductMock } from '@/modules/product/data/productMockData';

import '../styles/product.less';

const ProductList = () => {
  const { t } = useTranslation(['product', 'translation']);
  const { data, handleDelete, handleEdit } = useProductList();

  const columns = [
    { title: t('columns.name'), dataIndex: 'name', key: 'name' },
    { title: t('columns.category'), dataIndex: 'category', key: 'category' },
    { title: t('columns.price'), dataIndex: 'price', key: 'price' },
    {
      title: t('columns.action'),
      key: 'action',
      render: (_: unknown, record: ProductMock) => (
        <Space size="middle">
          <AppButton type="link" onClick={() => handleEdit(record.key)}>
            {t('common.actions.edit', { ns: 'translation' })}
          </AppButton>
          <AppButton danger type="link" onClick={() => handleDelete(record.key)}>
            {t('common.actions.delete', { ns: 'translation' })}
          </AppButton>
        </Space>
      ),
    },
  ];

  return (
    <div className="product-list-wrapper">
      <SEO title={t('seoTitle')} description={t('seoDescription')} />
      <div className="flex-between product-header">
        <h2>{t('title')}</h2>
        <AppButton type="primary">{t('addProduct')}</AppButton>
      </div>
      <Table 
        className="product-table" 
        columns={columns} 
        dataSource={data} 
        pagination={{ pageSize: 5 }} 
      />
    </div>
  );
};

export default ProductList;
