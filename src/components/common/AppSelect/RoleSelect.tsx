import React, { useMemo } from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { useGetRoleListQuery } from '@/modules/role/api/roleApi';

interface RoleSelectProps extends Omit<SelectProps, 'options' | 'loading'> {
}

export const RoleSelect: React.FC<RoleSelectProps> = ({ 
  style = { width: '100%' }, 
  placeholder,
  ...props 
}) => {
  const { t } = useTranslation('translation');
  const { data, isLoading } = useGetRoleListQuery();

  const options = useMemo(() => {
    const result = data?.result;
    const roles = Array.isArray(result) ? result : (result as any)?.data || [];
    
    return roles.map((role: any) => ({
      label: role.name,
      value: role._id,
    }));
  }, [data]);

  return (
    <Select
      showSearch
      allowClear
      loading={isLoading}
      placeholder={placeholder || t('common.filters.role', { defaultValue: 'Chọn vai trò' })}
      optionFilterProp="label"
      options={options}
      style={style}
      {...props}
    />
  );
};
