import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Breadcrumb, Flex, Typography, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { SEO } from '@/components/common/SEO/SEO';
import { AppLoader } from '@/components/common/AppLoader/AppLoader';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import { useAppNotify } from '@/hooks/useAppNotify';
import { 
  useGetProductListQuery, 
  useCreateProductMutation, 
  useUpdateProductMutation 
} from '../api/productApi';
import { ProductForm } from '../components/ProductForm';

const { Title, Text } = Typography;

const ProductUpsert: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation(['product', 'translation']);
  const { goToProducts } = useAppNavigate();
  const { notification } = useAppNotify();

  
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  
  
  
  const { data: listData, isLoading: isListLoading } = useGetProductListQuery({}, { skip: !id });

  const currentProduct = useMemo(() => {
    if (!id || !listData) return null;
    return listData.result.data.find(p => p._id === id) || null;
  }, [id, listData]);

  const loading = isCreating || isUpdating;

  const handleSave = async (values: any) => {
    try {
      if (id) {
        await updateProduct({ id, body: values }).unwrap();
        notification.success({
          message: t('common.messages.success', { ns: 'translation' }),
          description: t('messages.updateSuccess'),
        });
      } else {
        await createProduct(values).unwrap();
        notification.success({
          message: t('common.messages.success', { ns: 'translation' }),
          description: t('messages.createSuccess'),
        });
      }
      goToProducts();
    } catch (error: any) {
      notification.error({
        message: id ? t('messages.updateError') : t('messages.createError'),
        description: error?.data?.message || error?.message,
      });
    }
  };

  if (id && isListLoading) return <AppLoader />;

  return (
    <div className="product-upsert-page">
      <SEO 
        title={id ? t('titleEdit') : t('titleCreate')} 
        description={t('seoDescription')} 
      />
      
      <Flex vertical gap={24}>
        <Flex vertical gap={8}>
          <Breadcrumb
            items={[
              { title: t('title'), onClick: goToProducts, className: 'cursor-pointer' },
              { title: id ? t('titleEdit') : t('titleCreate') },
            ]}
          />
          <Flex align="center" gap={16}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={goToProducts}
              style={{ padding: 0 }}
            />
            <Title level={3} style={{ margin: 0 }}>
              {id ? t('titleEdit') : t('titleCreate')}
            </Title>
          </Flex>
          <Text type="secondary">
            {id ? `ID: ${id}` : t('seoDescription')}
          </Text>
        </Flex>

        <div style={{ maxWidth: 880 }}>
          <ProductForm
            initialValues={currentProduct}
            loading={loading}
            onSave={handleSave}
            onCancel={goToProducts}
          />
        </div>
      </Flex>
    </div>
  );
};

export default ProductUpsert;
