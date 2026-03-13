import { useMemo, memo } from 'react';
import { Space, Flex, Tag, Switch, Select, Typography, Col, Upload } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/common/AppTable';
import { SEO } from '@/components/common/SEO/SEO';
import { useServiceList } from '../hooks/useServiceList';
import { AppFilter } from '@/components/common/AppFilter/AppFilter';
import { AppSearchInput } from '@/components/common/AppInput/AppSearchInput';
import { AppButton } from '@/components/common/AppButton';
import { CachedImage } from '@/components/common/CachedImage/CachedImage';
import { formatCurrency } from '@/utils/format';
import { getFullImageUrl } from '@/store/api/uploadApi';
import { APP_ASSETS } from '@/config/assets';
import { PermissionGate } from '@/components/common/PermissionGate/PermissionGate';
import { usePermission } from '@/hooks/usePermission';
import { BranchSelect } from '@/components/common/AppSelect/BranchSelect';
import type { Service } from '../data/service.types';

const { Text } = Typography;

const ServiceList = () => {
  const {
    data,
    refetch,
    isLoading,
    isFetching,
    isReady,
    switchingId,
    handleDelete,
    handleBatchDelete,
    handleBatchUpdateStatus,
    handleSwitchStatus,
    handlePageChange,
    handleSearch,
    handleCategoryChange,
    handleStatusChange,
    handleBranchChange,
    handleExport,
    handleImport,
    params,
    resetFilters,
    total,
    t,
    rowSelection,
    selectedIds,
    setSelectedIds,
    categoryOptions,
    statusOptions,
    localCategory,
    localStatus,
    localBranchId,
    goToServiceCreate,
    goToServiceEdit,
  } = useServiceList();
  
  const { isSuperAdmin } = usePermission();

  const columns = useMemo(
    () => {
      const base: any[] = [
        {
          title: t('columns.index'),
          key: 'index',
          width: 60,
          align: 'center' as const,
          render: (_: any, __: any, index: number) => {
            const rowNumber = (params.page - 1) * params.page_size + index + 1;
            return <Text type="secondary">{rowNumber}</Text>;
          },
        },
        {
          title: t('columns.code'),
          dataIndex: 'code',
          key: 'code',
          width: 160,
          render: (code: string, record: Service) => (
            <Text strong onClick={() => goToServiceEdit(record._id)} className="clickable-code">
              {code}
            </Text>
          ),
        },
        {
          title: t('columns.name'),
          key: 'service',
          width: 300,
          render: (_: any, record: Service) => {
            const imagePath = record.thumbnail?.thumbnail?.path;
            const imageUrl = getFullImageUrl(imagePath) || APP_ASSETS.PRODUCT_PLACEHOLDER;

            return (
              <Flex gap={12} align="center">
                <div className="table-image-wrapper">
                  <CachedImage
                    src={imageUrl}
                    alt={record.name}
                    width={48}
                    height={48}
                    className="table-image"
                    isApiImage={false}
                  />
                </div>
                <Flex vertical>
                  <Text strong style={{ fontSize: '14px' }}>
                    {record.name}
                  </Text>
                </Flex>
              </Flex>
            );
          },
        },
        {
          title: t('columns.category'),
          dataIndex: ['category', 'name'],
          key: 'category',
          width: 150,
        },
      ];

      if (isSuperAdmin) {
        base.push({
          title: t('columns.branch', { defaultValue: 'Chi nhánh' }),
          dataIndex: ['branch', 'name'],
          key: 'branch',
          width: 200,
          render: (name: string, record: Service) => (
            <Flex vertical>
              <Text strong>{name}</Text>
              <Text type="secondary" className="text-xs">{record.branch?.code}</Text>
            </Flex>
          )
        });
      }

      base.push(
        {
          title: t('columns.price'),
          dataIndex: 'priceSale',
          key: 'priceSale',
          align: 'right' as const,
          render: (price: number) => <Text>{formatCurrency(price)}</Text>,
        },
        {
          title: t('columns.tax'),
          dataIndex: 'taxPercentage',
          key: 'taxPercentage',
          align: 'center' as const,
          render: (tax: number) => <Text>{tax}%</Text>,
        },
        {
          title: t('columns.totalPrice'),
          dataIndex: 'priceSaleWithTax',
          key: 'priceSaleWithTax',
          align: 'right' as const,
          render: (price: number) => (
            <Text strong type="success">
              {formatCurrency(price)}
            </Text>
          ),
        },
        {
          title: t('columns.status'),
          dataIndex: 'status',
          key: 'status',
          align: 'center' as const,
          width: 100,
          render: (status: number, record: Service) => (
            <Switch
              checked={status === 1}
              onChange={() => handleSwitchStatus(record._id, status)}
              loading={switchingId === record._id}
              size="small"
            />
          ),
        },
        {
          title: t('columns.action'),
          key: 'action',
          align: 'right' as const,
          render: (_: unknown, record: Service) => (
            <Space size="small">
              <PermissionGate module="service" action="update">
                <AppButton type="link" onClick={() => goToServiceEdit(record._id)}>
                  {t('common.actions.edit', { ns: 'translation' })}
                </AppButton>
              </PermissionGate>
              <PermissionGate module="service" action="delete">
                <AppButton danger type="link" onClick={() => handleDelete(record._id)}>
                  {t('common.actions.delete', { ns: 'translation' })}
                </AppButton>
              </PermissionGate>
            </Space>
          ),
        }
      );

      return base;
    },
    [
      t,
      switchingId,
      goToServiceEdit,
      handleDelete,
      handleSwitchStatus,
      params.page,
      params.page_size,
      isSuperAdmin,
    ]
  );

  return (
    <div className="service-list-wrapper">
      <SEO title={t('seoTitle')} description={t('seoDescription')} />

      <div className="sticky-filter">
        <AppFilter 
          onReset={resetFilters} 
          onRefresh={refetch}
          isLoading={isFetching}
        >
          <Col xs={24} sm={12} md={8} lg={8}>
            <AppSearchInput
              placeholder={t('filter.keyword')}
              value={params.keyword}
              debounceTime={300}
              onSearch={handleSearch}
            />
          </Col>
          {isSuperAdmin && (
            <Col xs={12} sm={6} md={5} lg={5}>
              <BranchSelect 
                value={localBranchId}
                onChange={handleBranchChange}
                placeholder={t('filter.branch', { defaultValue: 'Tất cả chi nhánh' })}
              />
            </Col>
          )}
          <Col xs={12} sm={6} md={5} lg={5}>
            <Select
              style={{ width: '100%' }}
              placeholder={t('filter.category')}
              value={localCategory}
              onChange={handleCategoryChange}
              allowClear
              options={categoryOptions}
            />
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <Select
              style={{ width: '100%' }}
              placeholder={t('filter.status')}
              value={localStatus}
              onChange={handleStatusChange}
              allowClear
              options={statusOptions}
            />
          </Col>
        </AppFilter>
      </div>

      <AppCard
        title={
          <Flex align="center" gap={8}>
            <span>{t('title')}</span>
            <Tag className="card-title-tag tag-blue">
              {total}
            </Tag>
          </Flex>
        }
        extra={
          <Space>
            {selectedIds.length > 0 && (
              <>
                <AppButton
                  onClick={() => handleBatchUpdateStatus(selectedIds, 1, () => setSelectedIds([]))}
                  loading={isLoading}
                >
                  {t('status.active')}
                </AppButton>
                <AppButton
                  onClick={() => handleBatchUpdateStatus(selectedIds, 0, () => setSelectedIds([]))}
                  loading={isLoading}
                >
                  {t('status.inactive')}
                </AppButton>
                <PermissionGate module="service" action="delete">
                  <AppButton
                    danger
                    onClick={() => handleBatchDelete(selectedIds, () => setSelectedIds([]))}
                    loading={isLoading}
                  >
                    {t('common.actions.deleteSelected', {
                      ns: 'translation',
                      count: selectedIds.length,
                    })}
                  </AppButton>
                </PermissionGate>
              </>
            )}
            <PermissionGate module="service" action="create">
              <Space>
                <Upload
                  accept=".xlsx, .xls"
                  showUploadList={false}
                  beforeUpload={(file) => {
                    handleImport(file);
                    return false;
                  }}
                >
                  <AppButton icon={<UploadOutlined />}>
                    {t('common.actions.import', { ns: 'translation' })}
                  </AppButton>
                </Upload>
                <AppButton icon={<DownloadOutlined />} onClick={handleExport} loading={isLoading}>
                  {t('common.actions.export', { ns: 'translation' })}
                </AppButton>
                <AppButton type="primary" onClick={goToServiceCreate}>
                  {t('addService')}
                </AppButton>
              </Space>
            </PermissionGate>
          </Space>
        }
      >
        <div style={{ position: 'relative', minHeight: '400px' }}>
          <AppTable
            className="service-table"
            columns={columns}
            dataSource={data}
            rowKey="_id"
            showSkeleton={!isReady || (isLoading && data.length === 0)}
            skeletonRows={8}
            loading={isFetching}
            pagination={{
              total,
              current: params.page,
              pageSize: params.page_size,
              onChange: handlePageChange,
            }}
            rowSelection={rowSelection}
          />
        </div>
      </AppCard>
    </div>
  );
};

export default memo(ServiceList);
