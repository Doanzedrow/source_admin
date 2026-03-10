import { Table, Space } from 'antd';
import { AppButton } from '@/components/common/AppButton';
import { useTranslation } from 'react-i18next';
import { useProductList } from '@/modules/product/hooks/useProductList';
import type { ProductMock } from '@/modules/product/data/productMockData';

import '../styles/product.less';

const ProductList = () => {
  const { t } = useTranslation('product');
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
            {t('actions.edit')}
          </AppButton>
          <AppButton danger type="link" onClick={() => handleDelete(record.key)}>
            {t('actions.delete')}
          </AppButton>
        </Space>
      ),
    },
  ];

  return (
    <div className="product-list-wrapper">
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
