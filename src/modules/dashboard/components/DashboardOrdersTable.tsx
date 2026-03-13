import React from 'react';
import { Tag, Typography, Flex } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatDateTime } from '@/utils/format';
import type { DashboardOrder } from '../data/dashboard.types';
import { getOrderStatus, getPaymentStatus } from '../constants/order';
import { AppTable } from '@/components/common/AppTable';
import { usePermission } from '@/hooks/usePermission';

const { Text } = Typography;

export interface DashboardOrdersTableProps {
  data: DashboardOrder[];
  isLoading: boolean;
  isDeposit?: boolean;
  pagination?: TablePaginationConfig | false;
  totalMetaData?: any;
}

export const DashboardOrdersTable: React.FC<DashboardOrdersTableProps> = ({ 
  data, 
  isLoading, 
  isDeposit = false,
  pagination = false,
  totalMetaData
}) => {
  const { isSuperAdmin } = usePermission();
  const { t } = useTranslation('dashboard');

  const totalAmount = totalMetaData?.totalAmount || 0;
  const depositAmount = totalMetaData?.totalDeposit || 0;
  const remainingAmount = totalMetaData?.totalRemaining || 0;

  const baseColumns: any[] = [
    {
      title: '#',
      key: 'index',
      width: 50,
      align: 'center',
      render: (_, __, index: number) => {
        const currentPage = (pagination && typeof pagination === 'object' && pagination.current) ? pagination.current : 1;
        const pageSize = (pagination && typeof pagination === 'object' && pagination.pageSize) ? pagination.pageSize : 20;
        return (currentPage - 1) * pageSize + index + 1;
      }
    },
    {
      title: t('orders.table.orderCode'),
      dataIndex: 'code',
      key: 'code',
      render: (text, record: any) => <strong>{text || record.orderCode || '--'}</strong>
    },
    {
      title: t('orders.table.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => text ? formatDateTime(text) : '--'
    },
  ];

  if (isSuperAdmin) {
    baseColumns.push({
      title: t('columns.branch', { ns: 'dashboard', defaultValue: 'Chi nhánh' }),
      dataIndex: ['branch', 'name'],
      key: 'branch',
      render: (name: string, record: any) => (
        <Flex vertical>
          <Text strong>{name}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.branch?.code}</Text>
        </Flex>
      )
    });
  }

  baseColumns.push(
    {
      title: t('orders.table.customer'),
      dataIndex: 'customer',
      key: 'customer',
      render: (_, record: any) => record.customer?.fullname || record.customer?.name || '--'
    },
    {
      title: t('orders.table.totalAmount'),
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (val, record: any) => {
        const v = typeof val === 'number' ? val : (record.value || 0);
        return <strong>{formatCurrency(v)}</strong>;
      }
    },
    ...(isDeposit ? [
      {
        title: t('orders.table.depositAmount'),
        dataIndex: 'depositAmount',
        key: 'depositAmount',
        render: (val: number) => <strong>{formatCurrency(val || 0)}</strong>
      },
      {
        title: t('orders.table.remainingAmount'),
        dataIndex: 'remainingAmount',
        key: 'remainingAmount',
        render: (val: number) => <strong>{formatCurrency(val || 0)}</strong>
      }
    ] : []),
    {
      title: t('orders.table.expectedDeliveryDate'),
      dataIndex: 'deadline',
      key: 'deadline',
      render: (text, record: any) => {
        const dateStr = text || record.deadline || record.expectedDeliveryDate || record.deliveryDate;
        return dateStr ? formatDateTime(dateStr) : '--';
      }
    },
    {
      title: t('orders.table.orderStatus'),
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (val, record: any) => {
        const status = val ?? record.status;
        if (status === undefined || status === null) return '--';
        
        const statusConfig = getOrderStatus(status as number);
        if (!statusConfig) return <Tag color="blue" variant="filled">{status}</Tag>;
        
        return (
          <Tag color={statusConfig.backgroundColor} variant="filled" style={{ color: statusConfig.textColor }}>
            {t(`orders.status.${statusConfig.name}`)}
          </Tag>
        );
      }
    },
    {
      title: t('orders.table.paymentStatus'),
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (val) => {
        if (val === undefined || val === null) return '--';

        const paymentConfig = getPaymentStatus(val as number);
        if (!paymentConfig) return <Tag color="cyan" variant="filled">{val}</Tag>;
        
        return (
          <Tag color={paymentConfig.backgroundColor} variant="filled" style={{ color: paymentConfig.textColor }}>
            {t(`orders.paymentStatus.${paymentConfig.name}`)}
          </Tag>
        );
      }
    }
  );

  const columns: ColumnsType<DashboardOrder> = baseColumns;

  return (
    <div className="orders-table-wrapper">
      <AppTable<DashboardOrder>
        columns={columns} 
        dataSource={data} 
        rowKey="_id"
        pagination={pagination}
        showSkeleton={isLoading}
        skeletonRows={5}
        summary={() => {
          if (!data || data.length === 0) return null;
          return (
            <AppTable.Summary fixed="top">
              <AppTable.Summary.Row className="summary-row-highlight">
                <AppTable.Summary.Cell index={0} colSpan={isSuperAdmin ? 5 : 4}>
                  <strong>{t('orders.table.summaryTotal')}</strong>
                </AppTable.Summary.Cell>
                <AppTable.Summary.Cell index={isSuperAdmin ? 5 : 4}>
                  <strong style={{ color: 'var(--primary-color)' }}>{formatCurrency(totalAmount)}</strong>
                </AppTable.Summary.Cell>
                {isDeposit && (
                  <>
                    <AppTable.Summary.Cell index={isSuperAdmin ? 6 : 5}>
                      <strong style={{ color: 'var(--success-color)' }}>{formatCurrency(depositAmount)}</strong>
                    </AppTable.Summary.Cell>
                    <AppTable.Summary.Cell index={isSuperAdmin ? 7 : 6}>
                      <strong style={{ color: 'var(--warning-color)' }}>{formatCurrency(remainingAmount)}</strong>
                    </AppTable.Summary.Cell>
                  </>
                )}
                <AppTable.Summary.Cell index={isDeposit ? (isSuperAdmin ? 8 : 7) : (isSuperAdmin ? 6 : 5)} colSpan={3} />
              </AppTable.Summary.Row>
            </AppTable.Summary>
          );
        }}
      />
    </div>
  );
};
