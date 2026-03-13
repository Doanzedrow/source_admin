import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppCard } from '@/components/common/AppCard';
import { SEO } from '@/components/common/SEO/SEO';
import { AppBreadcrumb } from '@/components/common/AppBreadcrumb';
import { AppLoader } from '@/components/common/AppLoader/AppLoader';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import { rc, RouteKey } from '@/routes/routeConfig';
import { useGetShiftByIdQuery } from '../api/shiftApi';
import { ShiftForm } from '../components/ShiftForm';

const ShiftUpsert: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { t } = useTranslation(['shift', 'common']);
  const { goToShiftList } = useAppNavigate() as any;

  const { data, isLoading } = useGetShiftByIdQuery(id!, {
    skip: !isEdit,
  });

  const initialValues = data?.result || null;
  const title = isEdit ? t('editShift') : t('addShift');

  if (isEdit && isLoading) return <AppLoader />;

  return (
    <div className="shift-upsert-page">
      <SEO title={title} />
      
      <div className="upsert-header">
        <AppBreadcrumb
          items={[
            { title: t('title'), link: rc(RouteKey.Shift).path },
            { title: title },
          ]}
          title={title}
          onBack={goToShiftList}
          id={id}
        />
      </div>

      <AppCard className="form-container">
        <ShiftForm
          initialValues={initialValues}
          onSave={() => {}}
          loading={isLoading}
          isEdit={isEdit}
        />
      </AppCard>
    </div>
  );
};

export default React.memo(ShiftUpsert);
