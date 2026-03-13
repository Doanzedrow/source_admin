import { useMemo } from 'react';
import { Flex, Select, Col, Tag, Upload, Space } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
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
import { EmployeeSelect } from '@/components/common/AppSelect/EmployeeSelect';
import { ShiftSelect } from '@/components/common/AppSelect/ShiftSelect';
import { OrderDateFilter } from '../components/OrderDateFilter';
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
    handleUserChange,
    handleShiftChange,
    handleExport,
    handleImport,
    refetch,
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
          onRefresh={refetch}
          isLoading={isFetching}
          extra={
            <>
              <Col xs={24} sm={12} md={6}>
                <Select
                  allowClear
                  style={{ width: '100%' }}
                  placeholder={t('dashboard:orders.table.orderStatus')}
                  options={statusOptions}
                  value={filters.status}
                  onChange={handleStatusChange}
                />
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Select
                  allowClear
                  style={{ width: '100%' }}
                  placeholder={t('dashboard:orders.table.paymentStatus')}
                  options={paymentStatusOptions}
                  value={filters.paymentStatus}
                  onChange={handlePaymentStatusChange}
                />
              </Col>

              <Col xs={24} sm={12} md={6}>
                <ShiftSelect 
                  placeholder={t('filter.shift', { ns: 'shift', defaultValue: 'Chọn ca làm việc' })}
                  value={filters.shiftId}
                  onChange={handleShiftChange}
                />
              </Col>

              <Col xs={24} sm={12} md={6}>
                <EmployeeSelect 
                  placeholder={t('filter.employee', { ns: 'user', defaultValue: 'Chọn nhân viên' })}
                  value={filters.userId}
                  onChange={handleUserChange}
                />
              </Col>

              {isSuperAdmin && (
                <Col xs={24} sm={12} md={6}>
                  <BranchSelect 
                    placeholder={t('dashboard:columns.branch')} 
                    value={filters.branchId} 
                    onChange={handleBranchChange} 
                  />
                </Col>
              )}
            </>
          }
        >
          <Col span={24}>
            <OrderDateFilter 
              onChange={handleDateChange}
            />
          </Col>

          <Col span={24}>
            <AppSearchInput 
              placeholder={t('filter.searchPlaceholder')} 
              onSearch={handleSearch} 
              defaultValue={filters.keyword}
            />
          </Col>
        </AppFilter>
      </div>

      <AppCard 
        title={
          <Flex align="center" gap={8}>
            <span className="card-title-text">{t('dashboard:orders.title')}</span>
            <Tag  className="card-title-tag">{total}</Tag>
          </Flex>
        }
        extra={
          <Space>
            <PermissionGate module="order" action="create">
              <Upload
                accept=".xlsx, .xls"
                showUploadList={false}
                beforeUpload={(file) => {
                  handleImport(file);
                  return false;
                }}
              >
                <AppButton icon={<UploadOutlined />} loading={isLoading && !isFetching}>
                  {t('common.actions.import', { ns: 'translation' })}
                </AppButton>
              </Upload>
            </PermissionGate>
            <PermissionGate module="order" action="view">
              <AppButton 
                icon={<DownloadOutlined />} 
                onClick={handleExport} 
                loading={isLoading && !isFetching}
              >
                {t('common.actions.export', { ns: 'translation' })}
              </AppButton>
            </PermissionGate>
          </Space>
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
