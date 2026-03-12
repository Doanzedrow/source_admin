import React from 'react';
import { Form } from 'antd';
import { SEO } from '@/components/common/SEO/SEO';
import { AppLoader } from '@/components/common/AppLoader/AppLoader';
import { AppBreadcrumb } from '@/components/common/AppBreadcrumb';
import { AppCard } from '@/components/common/AppCard';
import { FormActions } from '@/components/common/FormActions';
import { AppButton } from '@/components/common/AppButton';
import { rc, RouteKey } from '@/routes/routeConfig';
import { ProductForm } from '../components/ProductForm';
import { ProductVariantSelector } from '../components/ProductVariantSelector';
import { useProductUpsert } from '../hooks/useProductUpsert';
import { useProductForm } from '../hooks/useProductForm';

import '../styles/product-form.less';


const ProductUpsertForm: React.FC<{
  id?: string;
  currentProduct: any;
  loading: boolean;
  handleSave: (values: any) => void;
  t: any;
  goToProducts: () => void;
}> = ({ id, currentProduct, loading, handleSave, t, goToProducts }) => {
  const {
    form,
    handleSubmit,
    onValuesChange,
    categories,
    isCategoriesLoading,
    initialThumbnailPath,
  } = useProductForm({
    initialValues: currentProduct,
    onSave: handleSave,
  });

  return (
    <Form
      form={form}
      layout="vertical"
      disabled={loading}
      onFinish={handleSubmit}
      onValuesChange={onValuesChange}
      scrollToFirstError
      requiredMark={false}
    >
      <div
        className="product-upsert-main-container"
        style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        <AppCard className="form-container">
          <ProductForm
            categories={categories}
            isCategoriesLoading={isCategoriesLoading}
            initialThumbnailPath={initialThumbnailPath}
            t={t}
          />
        </AppCard>

        <ProductVariantSelector />

        <FormActions isSticky={true} style={{ margin: 0 }}>
          <AppButton onClick={goToProducts} size="large">
            {t('common.actions.cancel', { ns: 'translation' })}
          </AppButton>
          <AppButton
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            style={{ minWidth: 150 }}
          >
            {id
              ? t('common.actions.update', { ns: 'translation' })
              : t('common.actions.create', { ns: 'translation' })}
          </AppButton>
        </FormActions>
      </div>
    </Form>
  );
};

const ProductUpsert: React.FC = () => {
  const { id, t, goToProducts, currentProduct, loading, isDetailLoading, handleSave } =
    useProductUpsert();

  const title = id ? t('titleEdit') : t('titleCreate');

  return (
    <div className="product-upsert-page">
      <SEO title={title} description={t('seoDescription')} />

      <div className="upsert-header">
        <AppBreadcrumb
          items={[{ title: t('title'), link: rc(RouteKey.Products).path }, { title: title }]}
          title={title}
          onBack={goToProducts}
          id={id}
        />
      </div>

      {id && isDetailLoading ? (
        <AppLoader />
      ) : (
        <ProductUpsertForm
          id={id}
          currentProduct={currentProduct}
          loading={loading}
          handleSave={handleSave}
          t={t}
          goToProducts={goToProducts}
        />
      )}
    </div>
  );
};

export default ProductUpsert;
