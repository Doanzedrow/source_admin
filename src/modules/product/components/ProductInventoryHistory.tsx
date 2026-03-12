import React, { useMemo } from 'react';
import { Typography, Flex, Tag } from 'antd';
import { HistoryOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { AppTable } from '@/components/common/AppTable';
import { AppCard } from '@/components/common/AppCard';
import { AppLoader } from '@/components/common/AppLoader/AppLoader';
import { useGetInventoryHistoriesQuery } from '../api/productApi';
import { formatDate } from '@/utils/format';

const { Text } = Typography;

interface ProductInventoryHistoryProps {
  productId: string;
}

export const ProductInventoryHistory: React.FC<ProductInventoryHistoryProps> = ({ productId }) => {
  const { t } = useTranslation(['product', 'translation']);
  const { data, isLoading } = useGetInventoryHistoriesQuery(productId, { skip: !productId });

  const columns = useMemo(() => [
    {
      title: t('columns.date', { ns: 'product' }),
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (date: string) => (
        <Text strong style={{ color: 'var(--primary-color)' }}>
          {formatDate(date)}
        </Text>
      ),
    },
    {
      title: t('columns.branch', { ns: 'product', defaultValue: 'Chi nhánh' }),
      dataIndex: 'branch',
      key: 'branch',
      width: 250,
      render: (branch: string) => (
        <Flex gap={4} align="center">
          <EnvironmentOutlined style={{ color: 'var(--secondary-color)', fontSize: '12px' }} />
          <Text>{branch}</Text>
        </Flex>
      ),
    },
    {
      title: t('columns.openingQty', { ns: 'product', defaultValue: 'Đầu kỳ' }),
      dataIndex: 'openingQty',
      key: 'openingQty',
      align: 'center' as const,
      width: 100,
      render: (val: number) => (
        <Tag color={val >= 0 ? 'blue' : 'error'} bordered={false}>
          {val}
        </Tag>
      ),
    },
    {
      title: t('columns.produceQty', { ns: 'product', defaultValue: 'Nhập/Sản xuất' }),
      dataIndex: 'produceQty',
      key: 'produceQty',
      align: 'center' as const,
      width: 120,
      render: (val: number) => (
        <Text type={val > 0 ? 'success' : 'secondary'} strong={val > 0}>
          {val > 0 ? `+${val}` : val}
        </Text>
      ),
    },
    {
      title: t('columns.saleQty', { ns: 'product', defaultValue: 'Tổng bán' }),
      dataIndex: 'saleQty',
      key: 'saleQty',
      align: 'center' as const,
      width: 100,
      render: (val: number, record: any) => (
        <Flex vertical align="center">
          <Text strong type="danger">{val > 0 ? `-${val}` : val}</Text>
          {(record.morningSaleQty > 0 || record.afternoonSaleQty > 0) && (
            <Text type="secondary" style={{ fontSize: '11px' }}>
              ({record.morningSaleQty}{t('shortMorning', { defaultValue: 'S' })} - {record.afternoonSaleQty}{t('shortAfternoon', { defaultValue: 'C' })})
            </Text>
          )}
        </Flex>
      ),
    },
    {
      title: t('columns.cancelQty', { ns: 'product', defaultValue: 'Hủy' }),
      dataIndex: 'cancelQty',
      key: 'cancelQty',
      align: 'center' as const,
      width: 100,
      render: (val: number) => (
        <Text type={val > 0 ? 'warning' : 'secondary'}>
          {val > 0 ? `-${val}` : val}
        </Text>
      ),
    },
    {
      title: t('columns.closingQty', { ns: 'product', defaultValue: 'Cuối kỳ' }),
      dataIndex: 'closingQty',
      key: 'closingQty',
      align: 'center' as const,
      width: 100,
      render: (val: number) => (
        <Tag color={val >= 0 ? 'purple' : 'error'} style={{ fontWeight: 600 }}>
          {val}
        </Tag>
      ),
    },
    {
      title: t('columns.expectedQty', { ns: 'product', defaultValue: 'Dự kiến' }),
      dataIndex: 'expectedQty',
      key: 'expectedQty',
      align: 'center' as const,
      width: 100,
      render: (val: number) => <Text type="secondary">{val}</Text>,
    },
  ], [t]);

  if (isLoading) return <AppLoader />;

  return (
    <AppCard
      title={
        <Flex gap={8} align="center">
          <HistoryOutlined style={{ color: 'var(--primary-color)' }} />
          <span>{t('inventoryHistory', { ns: 'product', defaultValue: 'Lịch sử tồn kho' })}</span>
        </Flex>
      }
      className="product-inventory-history-card"
      style={{ marginTop: '24px' }}
    >
      <AppTable
        columns={columns}
        dataSource={data?.result || []}
        rowKey={(record) => `${record.date}-${record.branch}`}
        pagination={false}
        hidePagination
        scroll={{ x: 1000 }}
      />
    </AppCard>
  );
};

export default ProductInventoryHistory;
