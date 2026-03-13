import React, { useMemo } from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { useGetUserListQuery } from '@/modules/user/api/userApi';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';

interface EmployeeSelectProps extends Omit<SelectProps, 'options' | 'loading'> {
  // Any additional props if needed
}

/**
 * Common Employee Select component that fetches data from User API.
 */
export const EmployeeSelect: React.FC<EmployeeSelectProps> = ({ 
  style = { width: '100%' }, 
  placeholder,
  ...props 
}) => {
  const { t } = useTranslation(['translation', 'user']);
  // Fetching users with default page size
  const { data, isLoading } = useGetUserListQuery({ page: 1, page_size: DEFAULT_PAGE_SIZE });

  const options = useMemo(() => {
    const users = data?.result?.data || [];
    
    return users.map((user: any) => ({
      label: user.fullname || user.userName,
      value: user._id,
    }));
  }, [data]);

  return (
    <Select
      showSearch
      allowClear
      loading={isLoading}
      placeholder={placeholder || t('common.placeholders.select', { ns: 'translation' })}
      optionFilterProp="label"
      options={options}
      style={style}
      {...props}
    />
  );
};
