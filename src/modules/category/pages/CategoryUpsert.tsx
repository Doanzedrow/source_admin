import { memo } from 'react';
import { SEO } from '@/components/common/SEO/SEO';
import { AppLoader } from '@/components/common/AppLoader/AppLoader';
import { AppBreadcrumb } from '@/components/common/AppBreadcrumb';
import { AppCard } from '@/components/common/AppCard';
import { rc, RouteKey } from '@/routes/routeConfig';
import { CategoryForm } from '../components/CategoryForm';
import { useCategoryUpsert } from '../hooks/useCategoryUpsert';

import '../styles/category.less';

const CategoryUpsert: React.FC = () => {
  const { 
    id, 
    t, 
    goToCategories, 
    currentCategory, 
    loading, 
    isDetailLoading, 
    handleSave 
  } = useCategoryUpsert();

  if (id && isDetailLoading) return <AppLoader />;

  return (
    <div className="category-upsert-page">
      <SEO 
        title={id ? t('titleEdit') : t('titleCreate')} 
        description={t('seoDescription')} 
      />
      
      <div className="upsert-header">
        <AppBreadcrumb
          items={[
            { title: t('title'), link: rc(RouteKey.Category).path },
            { title: id ? t('titleEdit') : t('titleCreate') },
          ]}
          title={id ? t('titleEdit') : t('titleCreate')}
          onBack={goToCategories}
          id={id}
        />
      </div>

      <AppCard className="form-container">
        <CategoryForm
          initialValues={currentCategory}
          loading={loading}
          onSave={handleSave}
          isEdit={!!id}
        />
      </AppCard>
    </div>
  );
};

export default memo(CategoryUpsert);
