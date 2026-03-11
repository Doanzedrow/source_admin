import React from 'react';
import { Tag } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatDateTime, formatDate } from '@/utils/format';
import type { DashboardOrder } from '../data/dashboard.types';
import { getOrderStatus, getPaymentStatus } from '../constants/order';
import { AppTable } from '@/components/common/AppTable';

export interface DashboardOrdersTableProps {
  data: DashboardOrder[];
  isLoading: boolean;
  isDeposit?: boolean;
  pagination?: TablePaginationConfig | false;
}

export const DashboardOrdersTable: React.FC<DashboardOrdersTableProps> = ({ 
  data, 
  isLoading, 
  isDeposit = false,
  pagination = false
}) => {
  const { t } = useTranslation('dashboard');

  const totalAmount = data?.reduce((sum, item) => sum + (item.totalAmount || item.value || 0), 0) || 0;
  const depositAmount = data?.reduce((sum, item) => sum + (item.depositAmount || 0), 0) || 0;
  const remainingAmount = data?.reduce((sum, item) => sum + (item.remainingAmount || 0), 0) || 0;

  const dataSource = data && data.length > 0 
    ? [
        { 
          _id: 'SUMMARY_ROW', 
          isSummary: true, 
          totalAmount, 
          depositAmount, 
          remainingAmount 
        } as unknown as DashboardOrder,
        ...data
      ] 
    : [];

  const columns: ColumnsType<DashboardOrder> = [
    {
      title: t('orders.table.orderCode'),
      dataIndex: 'code',
      key: 'code',
      onCell: (record: any) => ({ colSpan: record.isSummary ? 3 : 1 }),
      render: (text, record: any) => {
        if (record.isSummary) {
          return <strong style={{ color: 'var(--text-primary)' }}>{t('orders.table.summaryTotal')}</strong>;
        }
        return <strong>{text || record.orderCode || '--'}</strong>;
      }
    },
    {
      title: t('orders.table.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      onCell: (record: any) => ({ colSpan: record.isSummary ? 0 : 1 }),
      render: (text, record: any) => {
        if (record.isSummary) return null;
        return text ? formatDateTime(text) : '--';
      }
    },
    {
      title: t('orders.table.customer'),
      dataIndex: 'customer',
      key: 'customer',
      onCell: (record: any) => ({ colSpan: record.isSummary ? 0 : 1 }),
      render: (_, record: any) => {
        if (record.isSummary) return null;
        return record.customer?.fullname || record.customer?.name || '--';
      }
    },
    {
      title: t('orders.table.totalAmount'),
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (val, record: any) => {
        const v = typeof val === 'number' ? val : (record.value || 0);
        return <strong style={{ color: record.isSummary ? 'var(--primary-color)' : 'inherit' }}>{formatCurrency(v)}</strong>;
      }
    },
    ...(isDeposit ? [
      {
        title: t('orders.table.depositAmount'),
        dataIndex: 'depositAmount',
        key: 'depositAmount',
        render: (val: number, record: any) => {
          return <strong style={{ color: record.isSummary ? 'var(--success-color)' : 'inherit' }}>{formatCurrency(val || 0)}</strong>;
        }
      },
      {
        title: t('orders.table.remainingAmount'),
        dataIndex: 'remainingAmount',
        key: 'remainingAmount',
        render: (val: number, record: any) => {
          return <strong style={{ color: record.isSummary ? 'var(--warning-color)' : 'inherit' }}>{formatCurrency(val || 0)}</strong>;
        }
      }
    ] : []),
    {
      title: t('orders.table.expectedDeliveryDate'),
      dataIndex: 'expectedDeliveryDate',
      key: 'expectedDeliveryDate',
      onCell: (record: any) => ({ colSpan: record.isSummary ? 3 : 1 }),
      render: (text, record: any) => {
        if (record.isSummary) return null;
        const dateStr = text || record.deliveryDate;
        return dateStr ? formatDate(dateStr) : '--';
      }
    },
    {
      title: t('orders.table.orderStatus'),
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      onCell: (record: any) => ({ colSpan: record.isSummary ? 0 : 1 }),
      render: (val, record: any) => {
        if (record.isSummary) return null;
        const status = val ?? record.status;
        if (status === undefined || status === null) return '--';
        
        const statusConfig = getOrderStatus(status as number);
        if (!statusConfig) return <Tag color="blue">{status}</Tag>;
        
        return (
          <Tag color={statusConfig.backgroundColor} style={{ color: statusConfig.textColor }}>
            {t(`orders.status.${statusConfig.name}`)}
          </Tag>
        );
      }
    },
    {
      title: t('orders.table.paymentStatus'),
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      onCell: (record: any) => ({ colSpan: record.isSummary ? 0 : 1 }),
      render: (val, record: any) => {
        if (record.isSummary) return null;
        if (val === undefined || val === null) return '--';

        const paymentConfig = getPaymentStatus(val as number);
        if (!paymentConfig) return <Tag color="cyan">{val}</Tag>;
        
        return (
          <Tag color={paymentConfig.backgroundColor} style={{ color: paymentConfig.textColor }}>
            {t(`orders.paymentStatus.${paymentConfig.name}`)}
          </Tag>
        );
      }
    }
  ];

  return (
    <div className="orders-table-wrapper">
      <AppTable<DashboardOrder>
        columns={columns} 
        dataSource={dataSource} 
        rowKey="_id"
        pagination={pagination ? { ...pagination, pageSize: Math.max(pagination.pageSize || 0, dataSource.length) } : false}
        loading={isLoading}
        rowClassName={(record: any) => record.isSummary ? 'summary-row-highlight' : ''}
      />
    </div>
  );
};
