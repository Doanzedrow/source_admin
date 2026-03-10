import React from 'react';
import { Result } from 'antd';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/common/AppButton';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import './ErrorPage.less';

export interface ErrorPageProps {
  status: '403' | '404' | '500';
  title?: string;
  subTitle?: string;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ status, title, subTitle }) => {
  const { t } = useTranslation();
  const { goToDashboard } = useAppNavigate();

  const defaultTitles = {
    '403': '403',
    '404': '404',
    '500': '500', // Optional
  };

  const defaultSubtitles = {
    '403': t('forbidden'),
    '404': t('notFound'),
    '500': t('common.messages.error'), // Optional
  };

  return (
    <div className="error-page-wrapper">
      <Result
        status={status}
        title={title || defaultTitles[status]}
        subTitle={subTitle || defaultSubtitles[status]}
        extra={
          <AppButton type="primary" onClick={goToDashboard}>
            {t('common.actions.backHome')}
          </AppButton>
        }
      />
    </div>
  );
};
