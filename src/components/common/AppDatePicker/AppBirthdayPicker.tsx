import React from 'react';
import { DatePicker } from 'antd';
import type { DatePickerProps } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import i18n from '@/i18n';

/**
 * Format configurations copied from format.ts to avoid circular dependencies if any,
 * but since format.ts is a utility, we can just import the logic.
 */
const getDateFormat = (): string => {
  const currentLang = (i18n.language || 'vi').split('-')[0];
  return currentLang === 'vi' ? 'DD/MM/YYYY' : 'MM/DD/YYYY';
};

export interface AppBirthdayPickerProps extends Omit<DatePickerProps, 'onChange' | 'value'> {
  value?: Dayjs | string | null;
  onChange?: (date: Dayjs | null, dateString: string | string[]) => void;
}

export const AppBirthdayPicker: React.FC<AppBirthdayPickerProps> = ({
  value,
  onChange,
  ...props
}) => {
  const format = getDateFormat();

  // Convert value to Dayjs if it's a string
  const dateValue = typeof value === 'string' ? dayjs(value) : value;

  const disabledDate = (current: Dayjs) => {
    // Can not select days after today
    const isFuture = current && current > dayjs().endOf('day');
    // Can not select years before $1900
    const isTooOld = current && current < dayjs('1900-01-01').startOf('day');
    
    return isFuture || isTooOld;
  };

  return (
    <DatePicker
      {...props}
      value={dateValue as Dayjs}
      onChange={onChange}
      format={format}
      disabledDate={disabledDate}
      style={{ width: '100%', ...props.style }}
      showToday={false}
    />
  );
};
