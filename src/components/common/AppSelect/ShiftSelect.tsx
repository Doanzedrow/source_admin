import React, { useMemo } from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { useGetShiftListAllQuery } from '@/modules/shift/api/shiftApi';

interface ShiftSelectProps extends Omit<SelectProps, 'options' | 'loading'> {
  // Any additional props if needed
}

/**
 * Common Shift Select component that fetches data from Shift API.
 */
export const ShiftSelect: React.FC<ShiftSelectProps> = ({ 
  style = { width: '100%' }, 
  placeholder,
  ...props 
}) => {
  const { t } = useTranslation(['translation', 'shift']);
  // Fetching shifts with non-paginated list API
  const { data, isLoading } = useGetShiftListAllQuery();

  const options = useMemo(() => {
    const shifts = data?.result || [];
    
    return shifts.map((shift: any) => ({
      label: `${shift.name} (${shift.startTime} - ${shift.endTime})`,
      value: shift._id,
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
