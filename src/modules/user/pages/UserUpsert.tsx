import React, { memo } from 'react';
import { SEO } from '@/components/common/SEO/SEO';
import { AppLoader } from '@/components/common/AppLoader/AppLoader';
import { AppBreadcrumb } from '@/components/common/AppBreadcrumb';
import { AppCard } from '@/components/common/AppCard';
import { rc, RouteKey } from '@/routes/routeConfig';
import { UserForm } from '../components/UserForm';
import { useUserUpsert } from '../hooks/useUserUpsert';

const UserUpsert: React.FC = () => {
  const { 
    id, 
    t, 
    goToUserList, 
    currentUser, 
    loading, 
    isDetailLoading, 
    handleSave 
  } = useUserUpsert();

  if (id && isDetailLoading) return <AppLoader />;

  return (
    <div className="user-upsert-page">
      <SEO 
        title={id ? t('editUser') : t('addUser')} 
      />
      
      <div className="upsert-header">
        <AppBreadcrumb
          items={[
            { title: t('title'), link: rc(RouteKey.Users).path },
            { title: id ? t('editUser') : t('addUser') },
          ]}
          title={id ? t('editUser') : t('addUser')}
          onBack={goToUserList}
          id={id}
        />
      </div>

      <AppCard className="form-container">
        <UserForm
          initialValues={currentUser}
          loading={loading}
          onSave={handleSave}
          isEdit={!!id}
        />
      </AppCard>
    </div>
  );
};

export default memo(UserUpsert);
