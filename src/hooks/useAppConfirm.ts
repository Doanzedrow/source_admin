import { App } from 'antd';
import { useTranslation } from 'react-i18next';
import { ExclamationCircleFilled } from '@ant-design/icons';
import React from 'react';

interface ConfirmProps {
  title?: string;
  content?: string;
  onOk: () => void | Promise<any>;
  okText?: string;
  cancelText?: string;
  okType?: 'primary' | 'danger' | 'default';
}

export const useAppConfirm = () => {
  const { t } = useTranslation();
  const { modal } = App.useApp();

  const confirmDelete = ({ 
    title = t('common.messages.confirmDelete'), 
    content = t('common.messages.deleteWarning'),
    onOk,
    okText = t('common.actions.confirm'),
    cancelText = t('common.actions.cancel'),
    okType = 'danger'
  }: ConfirmProps) => {
    modal.confirm({
      title,
      content,
      icon: React.createElement(ExclamationCircleFilled, { style: { color: '#ff4d4f' } }),
      okText,
      cancelText,
      okType: okType as any,
      centered: true,
      mask: {
        closable: true,
      },
      className: 'app-confirm-modal',
      onOk,
    });
  };

  const confirmBatchDelete = (count: number, onOk: () => void | Promise<any>) => {
    confirmDelete({
      title: t('common.messages.confirmDelete'),
      content: t('common.messages.batchDeleteWarning', { count }),
      onOk,
    });
  };

  return {
    confirmDelete,
    confirmBatchDelete,
  };
};
