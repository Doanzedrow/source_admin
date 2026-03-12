import React, { useMemo, memo, useState } from 'react';
import { Typography, Flex, Tag, ConfigProvider, Badge, Table } from 'antd';
import {
  HistoryOutlined,
  EnvironmentOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  BoxPlotOutlined,
  InfoCircleOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { AppTable } from '@/components/common/AppTable';
import { AppCard } from '@/components/common/AppCard';
import { LazyInView } from '@/components/common/LazyInView';
import { useProductInventoryHistory } from '../hooks/useProductInventoryHistory';
import { formatDate } from '@/utils/format';
import '../styles/product-history.less';

const { Text } = Typography;

interface ProductInventoryHistoryProps {
  productId: string;
}

const VariantDetailList = memo(
  ({ variants, t }: { variants: any[]; t: (key: string, options?: any) => string }) => {
    const variantColumns = useMemo(
      () => [
        {
          title: '#',
          key: 'index',
          width: 50,
          align: 'center' as const,
          render: (_: any, __: any, index: number) => (
            <Text type="secondary" style={{ fontSize: '11px' }}>
              {index + 1}
            </Text>
          ),
        },
        {
          title: t('form.variant', { ns: 'attribute', defaultValue: 'Biến thể' }),
          dataIndex: 'items',
          key: 'variant',
          render: (items: any[]) => (
            <Flex gap={6} wrap="wrap" align="center">
              {items.map((item, index) => (
                <React.Fragment key={item.variantId}>
                  <Flex align="center" gap={4}>
                    <Text type="secondary" style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                      {item.attributeName}:
                    </Text>
                    <Text strong style={{ fontSize: '12px' }}>
                      {item.variantName}
                    </Text>
                  </Flex>
                  {index < items.length - 1 && (
                    <Text type="secondary" style={{ color: '#d9d9d9' }}>
                      |
                    </Text>
                  )}
                </React.Fragment>
              ))}
            </Flex>
          ),
        },
        {
          title: t('columns.openingQty', { ns: 'product', defaultValue: 'Đầu' }),
          dataIndex: 'openingQty',
          key: 'openingQty',
          align: 'center' as const,
          width: 70,
        },
        {
          title: t('columns.expectedQty', { ns: 'product', defaultValue: 'Dự kiến' }),
          dataIndex: 'expectedQty',
          key: 'expectedQty',
          align: 'center' as const,
          width: 70,
          render: (val: number) => <Text type="secondary">{val || 0}</Text>,
        },
        {
          title: t('columns.produceQty', { ns: 'product', defaultValue: 'Sản xuất' }),
          dataIndex: 'produceQty',
          key: 'produceQty',
          align: 'center' as const,
          width: 80,
          render: (val: number) => <Text type={val > 0 ? 'success' : 'secondary'}>{val || 0}</Text>,
        },
        {
          title: t('columns.saleQty', { ns: 'product', defaultValue: 'Tổng bán' }),
          dataIndex: 'saleQty',
          key: 'saleQty',
          align: 'center' as const,
          width: 80,
          render: (val: number) => <Text type={val > 0 ? 'danger' : 'secondary'}>{val || 0}</Text>,
        },
        {
          title: t('columns.morningSaleQty', { ns: 'product', defaultValue: 'Sáng' }),
          dataIndex: 'morningSaleQty',
          key: 'morningSaleQty',
          align: 'center' as const,
          width: 60,
          render: (val: number) => <Text type="secondary">{val || 0}</Text>,
        },
        {
          title: t('columns.afternoonSaleQty', { ns: 'product', defaultValue: 'Tối' }),
          dataIndex: 'afternoonSaleQty',
          key: 'afternoonSaleQty',
          align: 'center' as const,
          width: 60,
          render: (val: number) => <Text type="secondary">{val || 0}</Text>,
        },
        {
          title: t('columns.closingQty', { ns: 'product', defaultValue: 'Cuối' }),
          dataIndex: 'closingQty',
          key: 'closingQty',
          align: 'center' as const,
          width: 70,
          render: (val: number) => <Text strong>{val}</Text>,
        },
        {
          title: t('columns.cancelQty', { ns: 'product', defaultValue: 'Huỷ' }),
          dataIndex: 'cancelQty',
          key: 'cancelQty',
          align: 'center' as const,
          width: 60,
          render: (val: number) => <Text type={val > 0 ? 'danger' : 'secondary'}>{val || 0}</Text>,
        },
      ],
      [t]
    );

    return (
      <div className="nested-variant-container">
        <div className="nested-header">
          <BoxPlotOutlined style={{ color: 'var(--primary-color)' }} />
          <Text strong style={{ fontSize: '12px', color: '#8c8c8c', textTransform: 'uppercase' }}>
            {t('variantDetails', { ns: 'product' })}
          </Text>
          <div className="header-line" />
        </div>
        <Table
          columns={variantColumns}
          dataSource={variants}
          rowKey={(v) => v.items.map((i: any) => i.variantId).join('-')}
          pagination={false}
          size="small"
          className="nested-variant-table"
          bordered={false}
        />
      </div>
    );
  }
);

const InventoryHistoryContent: React.FC<ProductInventoryHistoryProps> = ({ productId }) => {
  const { t, data, isLoading, isReady, isEmpty, rawCount } = useProductInventoryHistory(productId);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const deferredData = React.useDeferredValue(data);

  const columns = useMemo(
    () => [
      {
        title: '#',
        key: 'index',
        width: 60,
        align: 'center' as const,
        render: (_: any, __: any, index: number) => {
          const rowNumber = (currentPage - 1) * pageSize + index + 1;
          return <Text type="secondary">{rowNumber}</Text>;
        },
      },
      {
        title: t('columns.date', { ns: 'product' }),
        dataIndex: 'date',
        key: 'date',
        width: 140,
        render: (date: string) => (
          <Flex vertical gap={2}>
            <Text strong className="col-highlight">
              {formatDate(date)}
            </Text>
          </Flex>
        ),
      },
      {
        title: t('columns.branch', { ns: 'product', defaultValue: 'Chi nhánh' }),
        dataIndex: 'branch',
        key: 'branch',
        width: 180,
        render: (branch: string) => (
          <Flex gap={8} align="center">
            <EnvironmentOutlined style={{ color: 'var(--primary-color)' }} />

            <Text className="branch-text" style={{ fontSize: '13px' }}>
              {branch}
            </Text>
          </Flex>
        ),
      },
      {
        title: t('columns.openingQty', { ns: 'product', defaultValue: 'Tồn đầu' }),
        dataIndex: 'openingQty',
        key: 'openingQty',
        align: 'center' as const,
        width: 100,
        render: (val: number) => (
          <Tag color="processing" variant="filled" className="qty-tag">
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
        render: (val: number) => (
          <Flex align="center" justify="center" gap={4}>
            <BoxPlotOutlined style={{ color: '#bfbfbf', fontSize: '12px' }} />
            <Text type="secondary">{val || 0}</Text>
          </Flex>
        ),
      },
      {
        title: t('columns.produceQty', { ns: 'product', defaultValue: 'Sản xuất' }),
        dataIndex: 'produceQty',
        key: 'produceQty',
        align: 'center' as const,
        width: 120,
        render: (val: number) => (
          <Flex align="center" justify="center" gap={4}>
            {val > 0 && (
              <ArrowUpOutlined style={{ color: 'var(--success-color)', fontSize: '10px' }} />
            )}
            <Text type={val > 0 ? 'success' : 'secondary'} strong={val > 0}>
              {val || 0}
            </Text>
          </Flex>
        ),
      },
      {
        title: t('columns.saleQty', { ns: 'product', defaultValue: 'Tổng bán' }),
        dataIndex: 'saleQty',
        key: 'saleQty',
        align: 'center' as const,
        width: 120,
        render: (val: number) => (
          <Flex align="center" justify="center" gap={4}>
            {val > 0 && (
              <ArrowDownOutlined style={{ color: 'var(--error-color)', fontSize: '10px' }} />
            )}
            <Text strong type="danger">
              {val || 0}
            </Text>
          </Flex>
        ),
      },
      {
        title: t('columns.morningSaleQty', { ns: 'product', defaultValue: 'Ca sáng' }),
        dataIndex: 'morningSaleQty',
        key: 'morningSaleQty',
        align: 'center' as const,
        width: 100,
        render: (val: number) => (
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {val || 0}
          </Text>
        ),
      },
      {
        title: t('columns.afternoonSaleQty', { ns: 'product', defaultValue: 'Ca tối' }),
        dataIndex: 'afternoonSaleQty',
        key: 'afternoonSaleQty',
        align: 'center' as const,
        width: 100,
        render: (val: number) => (
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {val || 0}
          </Text>
        ),
      },
      {
        title: t('columns.closingQty', { ns: 'product', defaultValue: 'Tồn cuối' }),
        dataIndex: 'closingQty',
        key: 'closingQty',
        align: 'center' as const,
        width: 100,
        render: (val: number) => (
          <Tag color={val > 0 ? 'purple' : 'error'} variant="filled" className="qty-tag">
            {val || 0}
          </Tag>
        ),
      },
      {
        title: t('columns.cancelQty', { ns: 'product', defaultValue: 'Huỷ' }),
        dataIndex: 'cancelQty',
        key: 'cancelQty',
        align: 'center' as const,
        width: 80,
        render: (val: number) => <Text type={val > 0 ? 'danger' : 'secondary'}>{val || 0}</Text>,
      },
    ],
    [t, currentPage, pageSize]
  );

  return (
    <AppCard
      collapsible
      defaultCollapsed={true}
      title={
        <Flex justify="space-between" align="center" style={{ width: '100%' }}>
          <Flex gap={8} align="center">
            <HistoryOutlined style={{ color: 'var(--primary-color)' }} />
            <span>{t('inventoryHistory', { ns: 'product' })}</span>
            <Badge
              count={rawCount}
              style={{ backgroundColor: 'var(--primary-color)', opacity: 0.6 }}
              overflowCount={999}
            />
          </Flex>
        </Flex>
      }
      className="product-inventory-history-card"
    >
      {isEmpty && isReady && !isLoading ? (
        <Flex vertical align="center" justify="center" style={{ padding: '60px 0' }} gap={12}>
          <InfoCircleOutlined style={{ fontSize: '32px', color: '#d9d9d9' }} />
          <Text type="secondary">{t('common.noData', { ns: 'translation' })}</Text>
        </Flex>
      ) : (
        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerBg: 'transparent',
                headerColor: 'var(--text-secondary)',
                headerBorderRadius: 8,
              },
            },
          }}
        >
          <AppTable
            className="inventory-table"
            columns={columns}
            dataSource={deferredData}
            rowKey={(record) => `${record.date}-${record.branch}`}
            showSkeleton={!isReady || isLoading}
            skeletonRows={6}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: deferredData.length,
              onChange: (page) => setCurrentPage(page),
              size: 'small',
              showSizeChanger: false,
              hideOnSinglePage: false,
              style: { marginTop: '16px', marginRight: '16px' },
            }}
            scroll={{ x: 1100 }}
            expandable={{
              expandedRowRender: (record) => (
                <VariantDetailList variants={record.variants || []} t={t} />
              ),
              rowExpandable: (record) => record.variants && record.variants.length > 0,
              expandRowByClick: true,
              columnWidth: 48,
              expandIcon: ({ expanded, onExpand, record, expandable }) => {
                if (!expandable) return null;
                return (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onExpand(record, e);
                    }}
                    style={{
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease',
                      transform: expanded ? 'rotate(90deg)' : 'none',
                      color: 'var(--primary-color)',
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <RightOutlined />
                  </div>
                );
              },
            }}
          />
        </ConfigProvider>
      )}
    </AppCard>
  );
};

export const ProductInventoryHistory: React.FC<ProductInventoryHistoryProps> = (props) => {
  return (
    <LazyInView>
      <InventoryHistoryContent {...props} />
    </LazyInView>
  );
};

export default memo(ProductInventoryHistory);
