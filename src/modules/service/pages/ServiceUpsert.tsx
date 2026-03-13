import React from 'react';
import { Form } from 'antd';
import { SEO } from '@/components/common/SEO/SEO';
import { AppLoader } from '@/components/common/AppLoader/AppLoader';
import { AppBreadcrumb } from '@/components/common/AppBreadcrumb';
import { AppCard } from '@/components/common/AppCard';
import { FormActions } from '@/components/common/FormActions';
import { AppButton } from '@/components/common/AppButton';
import { rc, RouteKey } from '@/routes/routeConfig';
import { ServiceForm } from '../components/ServiceForm';
import { useServiceUpsert } from '../hooks/useServiceUpsert';
import { useServiceForm } from '../hooks/useServiceForm';

const ServiceUpsert: React.FC = () => {
  const { 
    id, 
    t, 
    goToServiceList, 
    currentService, 
    loading, 
    isDetailLoading, 
    handleSave 
  } = useServiceUpsert();

  const {
    form,
    handleSubmit,
    onValuesChange,
    categories,
    isCategoriesLoading,
    initialMediaPaths,
  } = useServiceForm({
    initialValues: currentService,
    onSave: handleSave,
  });

  const title = id ? t('titleEdit') : t('titleCreate');

  if (id && isDetailLoading) {
    return <AppLoader />;
  }

  return (
    <div className="service-upsert-page">
      <SEO title={title} description={t('seoDescription')} />

      <div className="upsert-header">
        <AppBreadcrumb
          items={[
            { title: t('title'), link: rc(RouteKey.Service).path }, 
            { title: title }
          ]}
          title={title}
          onBack={goToServiceList}
          id={id}
        />
      </div>

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
          className="service-upsert-main-container" 
          style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          <AppCard 
            className="form-container" 
            title={t('form.info')}
          >
            <ServiceForm
              categories={categories}
              isCategoriesLoading={isCategoriesLoading}
              initialMediaPaths={initialMediaPaths}
              t={t}
            />
          </AppCard>

          <FormActions isSticky={true} style={{ margin: 0 }}>
            <AppButton onClick={goToServiceList} size="large">
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
    </div>
  );
};

export default ServiceUpsert;
