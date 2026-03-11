import { useMemo, useCallback, useState, memo, useEffect, useDeferredValue } from 'react';
import { Space, Tag, Switch, Typography, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppTable } from '@/components/common/AppTable';
import { SEO } from '@/components/common/SEO/SEO';
import { useCategoryList } from '../hooks/useCategoryList';
import type { Category } from '../data/category.types';
import { AppFilter } from '@/components/common/AppFilter/AppFilter';
import { AppSearchInput } from '@/components/common/AppInput/AppSearchInput';
import { AppLoader } from '@/components/common/AppLoader/AppLoader';

import '../styles/category.less';

const { Text } = Typography;

const CategoryList = () => {
  const { t } = useTranslation(['category', 'translation']);
  const { 
    data, 
    isLoading, 
    isFetching,
    handleDelete, 
    handleSwitchStatus, 
    switchingId,
    params, 
    setFilters, 
    resetFilters,
    handlePageChange, 
    total 
  } = useCategoryList();

  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = useCallback((val: string) => {
    setFilters({ keyword: val, page: 1 });
  }, [setFilters]);

  const columns = useMemo(() => [
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
      width: 150,
      render: (code: string) => <Text strong>{code}</Text>,
    },
    {
      title: t('columns.name'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: t('columns.totalProduct'),
      dataIndex: 'totalProduct',
      key: 'totalProduct',
      align: 'center' as const,
      width: 120,
      render: (count: number) => (
        <Tag color="blue" style={{ borderRadius: '12px', padding: '0 12px' }}>
          {count || 0}
        </Tag>
      ),
    },
    {
      title: t('columns.type'),
      dataIndex: 'type',
      key: 'type',
      width: 130,
      render: (type: number) => (
        <Tag color={type === 1 ? 'orange' : 'cyan'}>
          {type === 1 ? t('type.product') : t('type.service')}
        </Tag>
      ),
    },
    {
      title: t('columns.status'),
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      width: 100,
      render: (status: number, record: Category) => (
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
      width: 150,
      render: (_: unknown, record: Category) => (
        <Space size="small">
          <AppButton type="link">
            {t('common.actions.edit', { ns: 'translation' })}
          </AppButton>
          <AppButton danger type="link" onClick={() => handleDelete(record._id)}>
            {t('common.actions.delete', { ns: 'translation' })}
          </AppButton>
        </Space>
      ),
    },
  ], [t, switchingId, params.page, params.page_size, handleSwitchStatus, handleDelete]);

  const deferredData = useDeferredValue(data);

  return (
    <div className="category-list-wrapper">
      <SEO title={t('seoTitle')} description={t('seoDescription')} />
      
      <AppFilter onReset={resetFilters} isLoading={isFetching}>
        <Col xs={24} sm={16} md={12} lg={12}>
          <AppSearchInput
            placeholder={t('filter.keyword')}
            value={params.keyword}
            debounceTime={300}
            onSearch={handleSearch}
          />
        </Col>
      </AppFilter>

      <AppCard
        title={t('title')}
        extra={
          <AppButton type="primary">
            {t('addCategory')}
          </AppButton>
        }
      >
        <div style={{ position: 'relative', minHeight: '400px' }}>
          {isReady && (
            <AppTable
              className="category-table"
              columns={columns}
              dataSource={deferredData}
              rowKey="_id"
              pagination={{
                total,
                current: params.page,
                pageSize: params.page_size,
                onChange: handlePageChange,
              }}
            />
          )}
          
          <AppLoader 
            isLoading={!isReady || (isLoading && data.length === 0) || (isFetching && data.length > 0)} 
            overlay 
            tip={!isReady || isLoading ? t('loading', { ns: 'translation' }) : undefined}
          />
        </div>
      </AppCard>
    </div>
  );
};

export default memo(CategoryList);
