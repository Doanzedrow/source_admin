import { SEO } from '@/components/common/SEO/SEO';
import { AppLoader } from '@/components/common/AppLoader/AppLoader';
import { AppBreadcrumb } from '@/components/common/AppBreadcrumb';
import { AppCard } from '@/components/common/AppCard';
import { rc, RouteKey } from '@/routes/routeConfig';
import { ProductForm } from '../components/ProductForm';
import { useProductUpsert } from '../hooks/useProductUpsert';

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
      
      <div className="upsert-header">
        <AppBreadcrumb
          items={[
            { title: t('title'), link: rc(RouteKey.Products).path },
            { title: id ? t('titleEdit') : t('titleCreate') },
          ]}
          title={id ? t('titleEdit') : t('titleCreate')}
          onBack={goToProducts}
          id={id}
        />
      </div>

      <AppCard className="form-container">
        <ProductForm
          initialValues={currentProduct}
          loading={loading}
          onSave={handleSave}
        />
      </AppCard>
    </div>
  );
};

export default ProductUpsert;
