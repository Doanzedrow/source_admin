import React, { useMemo } from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { useGetBranchListQuery } from '@/modules/branch/api/branchApi';

interface BranchSelectProps extends Omit<SelectProps, 'options' | 'loading'> {
  // Any additional props if needed
}

/**
 * Common Branch Select component that fetches data from Branch API.
 * Uses /branch/list endpoint.
 */
export const BranchSelect: React.FC<BranchSelectProps> = ({ 
  style = { width: '100%' }, 
  placeholder,
  ...props 
}) => {
  const { t } = useTranslation('translation');
  const { data, isLoading } = useGetBranchListQuery();

  const options = useMemo(() => {
    const result = data?.result;
    const branches = Array.isArray(result) ? result : (result as any)?.data || [];
    
    return branches.map((branch: any) => ({
      label: branch.name,
      value: branch._id,
    }));
  }, [data]);

  return (
    <Select
      showSearch
      allowClear
      loading={isLoading}
      placeholder={placeholder || t('common.filters.branch', { defaultValue: 'Chọn chi nhánh' })}
      optionFilterProp="label"
      options={options}
      style={style}
      {...props}
    />
  );
};
