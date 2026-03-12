import { PageLoader } from '@/components/common/PageLoader';
import { AttributeForm } from '../components/AttributeForm';
import { useAttributeUpsert } from '../hooks/useAttributeUpsert';
import { AppBreadcrumb } from '@/components/common/AppBreadcrumb';
import { SEO } from '@/components/common/SEO/SEO';
import { AppCard } from '@/components/common/AppCard';
import { VariantManager } from '../components/VariantManager';
import { FormActions } from '@/components/common/FormActions';
import { AppButton } from '@/components/common/AppButton';
import { Alert, Space, Form } from 'antd';
import { TagsOutlined } from '@ant-design/icons';
import React from 'react';
import { useAttributeForm } from '../hooks/useAttributeForm';

import '../styles/attribute.less';

const AttributeUpsert: React.FC = () => {
  const { id, t, goToAttributes, currentAttribute, loading, isDetailLoading, handleSave } =
    useAttributeUpsert();

  const { form, handleSubmit, defaultValues } = useAttributeForm({
    initialValues: currentAttribute,
    onSave: handleSave,
    isLoading: isDetailLoading,
  });

  const title = id ? t('titleEdit') : t('titleCreate');

  if (id && isDetailLoading) return <PageLoader />;

  return (
    <div className="attribute-upsert-page">
      <SEO title={title} />

      <div className="upsert-header">
        <AppBreadcrumb
          items={[{ title: t('title'), link: '/attribute/list' }, { title }]}
          title={title}
          onBack={goToAttributes}
          id={id}
        />
      </div>

      <Form
        form={form}
        layout="vertical"
        disabled={loading}
        onFinish={handleSubmit}
        initialValues={defaultValues}
        scrollToFirstError
        requiredMark={false}
      >
        <div
          className="attribute-upsert-content"
          style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          <AppCard className="form-container">
            <AttributeForm form={form} />
            
            <FormActions isSticky={true}>
              <AppButton onClick={goToAttributes}>
                {t('common.actions.cancel', { ns: 'translation' })}
              </AppButton>
              <AppButton type="primary" htmlType="submit" loading={loading}>
                {id
                  ? t('common.actions.update', { ns: 'translation' })
                  : t('common.actions.create', { ns: 'translation' })}
              </AppButton>
            </FormActions>
          </AppCard>

          {id ? (
            <VariantManager attributeId={id} variants={currentAttribute?.variants || []} />
          ) : (
            <AppCard
              title={
                <Space>
                  <TagsOutlined style={{ color: 'var(--primary-color)' }} />
                  <span>{t('form.variants')}</span>
                </Space>
              }
            >
              <Alert
                description={t('form.addVariantTip')}
                type="info"
                showIcon
                style={{ borderRadius: '8px' }}
              />
            </AppCard>
          )}
        </div>
      </Form>
    </div>
  );
};

export default AttributeUpsert;
