import { SEO } from '@/components/common/SEO/SEO';
import { AppLoader } from '@/components/common/AppLoader/AppLoader';
import { AppBreadcrumb } from '@/components/common/AppBreadcrumb';
import { AppCard } from '@/components/common/AppCard';
import { ProductForm } from '../components/ProductForm';
import { useProductUpsert } from '../hooks/useProductUpsert';

import '../styles/product-upsert.less';

const ProductUpsert: React.FC = () => {
  const { 
    id, 
    t, 
    goToProducts, 
    currentProduct, 
    loading, 
    isDetailLoading, 
    handleSave 
  } = useProductUpsert();

  if (id && isDetailLoading) return <AppLoader />;

  return (
    <div className="product-upsert-page">
      <SEO 
        title={id ? t('titleEdit') : t('titleCreate')} 
        description={t('seoDescription')} 
      />
      
      <AppBreadcrumb
        items={[
          { title: t('title'), link: '/products' },
          { title: id ? t('titleEdit') : t('titleCreate') },
        ]}
        title={id ? t('titleEdit') : t('titleCreate')}
        onBack={goToProducts}
        id={id}
      />

      <AppCard className="form-container">
        <ProductForm
          initialValues={currentProduct}
          loading={loading}
          onSave={handleSave}
          onCancel={goToProducts}
        />
      </AppCard>
    </div>
  );
};

export default ProductUpsert;
