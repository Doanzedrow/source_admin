import { PageLoader } from '@/components/common/PageLoader';
import { AttributeForm } from '../components/AttributeForm';
import { useAttributeUpsert } from '../hooks/useAttributeUpsert';
import { AppBreadcrumb } from '@/components/common/AppBreadcrumb';
import { SEO } from '@/components/common/SEO/SEO';
import { AppCard } from '@/components/common/AppCard';
import React from 'react';

import '../styles/attribute.less';

const AttributeUpsert: React.FC = () => {
  const { 
    id, 
    t, 
    goToAttributes,
    currentAttribute, 
    loading, 
    isDetailLoading, 
    handleSave 
  } = useAttributeUpsert();

  const title = id ? t('titleEdit') : t('titleCreate');

  if (id && isDetailLoading) return <PageLoader />;

  return (
    <div className="attribute-upsert-page">
      <SEO title={title} />
      
      <div className="upsert-header">
        <AppBreadcrumb
          items={[
            { title: t('title'), link: '/attribute/list' },
            { title },
          ]}
          title={title}
          onBack={goToAttributes}
          id={id}
        />
      </div>

      <AppCard className="form-container">
        <AttributeForm
          initialValues={currentAttribute}
          loading={loading}
          onSave={handleSave}
        />
      </AppCard>
    </div>
  );
};

export default AttributeUpsert;
