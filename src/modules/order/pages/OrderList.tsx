import { useMemo } from 'react';
import { Flex, Select, Col, Tag } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { AppCard } from '@/components/common/AppCard';
import { SEO } from '@/components/common/SEO/SEO';
import { useOrderList } from '../hooks/useOrderList';
import { AppFilter } from '@/components/common/AppFilter/AppFilter';
import { AppSearchInput } from '@/components/common/AppInput/AppSearchInput';
import { AppButton } from '@/components/common/AppButton';
import { PermissionGate } from '@/components/common/PermissionGate/PermissionGate';
import { usePermission } from '@/hooks/usePermission';
import { BranchSelect } from '@/components/common/AppSelect/BranchSelect';
import { DateFilter } from '@/components/common/DateFilter';
import { OrderTable } from '../components/OrderTable';
import { OrderStatus, PaymentStatus } from '../constants/order';

const OrderList = () => {
  const { t } = useTranslation(['order', 'dashboard', 'translation']);
  const {
    data,
    total,
    metaData,
    filters,
    isLoading,
    isFetching,
    handlePageChange,
    handleSearch,
    handleStatusChange,
    handlePaymentStatusChange,
    handleDateChange,
    handleBranchChange,
    handleExport,
    resetFilters,
  } = useOrderList();
  const { isSuperAdmin } = usePermission();

  const statusOptions = useMemo(() => [
    { label: t('dashboard:orders.status.draft'), value: OrderStatus.Draft },
    { label: t('dashboard:orders.status.inProduction'), value: OrderStatus.InProduction },
    { label: t('dashboard:orders.status.produced'), value: OrderStatus.Produced },
    { label: t('dashboard:orders.status.delivered'), value: OrderStatus.Delivered },
    { label: t('dashboard:orders.status.refunded'), value: OrderStatus.Refunded },
    { label: t('dashboard:orders.status.canceled'), value: OrderStatus.Canceled },
  ], [t]);

  const paymentStatusOptions = useMemo(() => [
    { label: t('dashboard:orders.paymentStatus.unpaid'), value: PaymentStatus.Unpaid },
    { label: t('dashboard:orders.paymentStatus.paid'), value: PaymentStatus.Paid },
    { label: t('dashboard:orders.paymentStatus.deposit'), value: PaymentStatus.Deposit },
    { label: t('dashboard:orders.paymentStatus.error'), value: PaymentStatus.Error },
  ], [t]);

  return (
    <div className="order-list-wrapper">
      <SEO title={t('dashboard:orders.title')} />
      
      <div className="sticky-filter">
        <AppFilter 
          onReset={resetFilters}
        >
          <Col span={6}>
            <AppSearchInput 
              placeholder={t('dashboard:orders.table.orderCode')} 
              onSearch={handleSearch} 
              defaultValue={filters.keyword}
            />
          </Col>

          <Col span={6}>
            <Select
              allowClear
              style={{ width: '100%' }}
              placeholder={t('dashboard:orders.table.orderStatus')}
              options={statusOptions}
              value={filters.status}
              onChange={handleStatusChange}
            />
          </Col>

          <Col span={6}>
            <Select
              allowClear
              style={{ width: '100%' }}
              placeholder={t('dashboard:orders.table.paymentStatus')}
              options={paymentStatusOptions}
              value={filters.paymentStatus}
              onChange={handlePaymentStatusChange}
            />
          </Col>

          {isSuperAdmin && (
            <Col span={6}>
              <BranchSelect 
                placeholder={t('dashboard:columns.branch')} 
                value={filters.branchId} 
                onChange={handleBranchChange} 
              />
            </Col>
          )}

          <Col span={6}>
            <DateFilter 
              onChange={handleDateChange}
            />
          </Col>
        </AppFilter>
      </div>

      <AppCard 
        title={
          <Flex align="center" gap={8}>
            <span className="card-title-text">{t('dashboard:orders.title')}</span>
            <Tag color="blue" className="card-title-tag">{total}</Tag>
          </Flex>
        }
        extra={
          <PermissionGate module="order" action="view">
            <AppButton 
              icon={<DownloadOutlined />} 
              onClick={handleExport} 
              loading={isLoading && !isFetching}
            >
              {t('common.actions.export', { ns: 'translation' })}
            </AppButton>
          </PermissionGate>
        }
      >
        <OrderTable 
          data={data}
          isLoading={isLoading || isFetching}
          pagination={{
            current: filters.page,
            pageSize: filters.page_size,
            total: total,
            onChange: handlePageChange,
            showSizeChanger: true,
          }}
          totalMetaData={metaData}
          isDeposit={filters.type === 1}
        />
      </AppCard>
    </div>
  );
};

export default OrderList;
