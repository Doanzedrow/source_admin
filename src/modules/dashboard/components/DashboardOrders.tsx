import React from 'react';
import { Flex, Tabs, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { AppCard } from '@/components/common/AppCard';
import { DateFilter } from '@/components/common/DateFilter';
import { DashboardOrdersTable } from './DashboardOrdersTable';
import { useDashboardOrders } from '../hooks/useDashboardOrders';

export const DashboardOrders: React.FC = () => {
  const { t } = useTranslation('dashboard');
  
  const {
    activeTab,
    setActiveTab,
    params,
    handleDateChange,
    handlePageChange,
    newOrders,
    depositOrders,
    draftOrders,
  } = useDashboardOrders();

  const activeData = activeTab === 'new' ? newOrders : activeTab === 'deposit' ? depositOrders : draftOrders;
  const total = activeData.total;

  const getPaginationOptions = (total: number) => ({
    current: params.page,
    pageSize: params.page_size,
    total,
    onChange: handlePageChange,
  });

  const items = [
    {
      key: 'new',
      label: t('orders.tabs.new'),
      children: (
        <DashboardOrdersTable 
          data={newOrders.data} 
          isLoading={newOrders.loading} 
          pagination={getPaginationOptions(newOrders.total)}
          totalMetaData={newOrders.metaData}
        />
      ),
    },
    {
      key: 'deposit',
      label: t('orders.tabs.deposit'),
      children: (
        <DashboardOrdersTable 
          data={depositOrders.data} 
          isLoading={depositOrders.loading} 
          isDeposit={true}
          pagination={getPaginationOptions(depositOrders.total)}
          totalMetaData={depositOrders.metaData}
        />
      ),
    },
    {
      key: 'draft',
      label: t('orders.tabs.draft'),
      children: (
        <DashboardOrdersTable 
          data={draftOrders.data} 
          isLoading={draftOrders.loading} 
          pagination={getPaginationOptions(draftOrders.total)}
          totalMetaData={draftOrders.metaData}
        />
      ),
    },
  ];

  return (
    <AppCard 
      className="dashboard-orders-card" 
      title={
        <Flex align="center" gap={8}>
          <span>{t('orders.title')}</span>
          <Tag className="card-title-tag">
            {total}
          </Tag>
        </Flex>
      }
      extra={
        <DateFilter 
          defaultValue="today" 
          style={{ width: 140 }}
          onChange={handleDateChange}
        />
      }
      styles={{ body: { padding: '0 24px 24px 24px' } }}
      style={{ marginTop: 24 }}
    >
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        items={items}
        animated={false}
      />
    </AppCard>
  );
};
