import React from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

export interface DateFilterProps {
  style?: React.CSSProperties;
  className?: string;
  defaultValue?: string;
  onChange: (startDate: string, endDate: string) => void;
}

export const DateFilter: React.FC<DateFilterProps> = ({ 
  style, 
  className,
  defaultValue = 'today', 
  onChange 
}) => {
  const { t } = useTranslation('dashboard');

  const handleChange = (value: string) => {
    let startDate = dayjs().format('YYYY-MM-DD');
    let endDate = dayjs().format('YYYY-MM-DD');

    switch (value) {
      case 'yesterday':
        startDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
        endDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
        break;
      case 'thisWeek':
        startDate = dayjs().startOf('week').format('YYYY-MM-DD');
        endDate = dayjs().endOf('week').format('YYYY-MM-DD');
        break;
      case 'last30Days':
        startDate = dayjs().subtract(29, 'days').format('YYYY-MM-DD');
        endDate = dayjs().format('YYYY-MM-DD');
        break;
      case 'thisMonth':
        startDate = dayjs().startOf('month').format('YYYY-MM-DD');
        endDate = dayjs().endOf('month').format('YYYY-MM-DD');
        break;
      case 'lastMonth':
        startDate = dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
        endDate = dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
        break;
      case 'today':
      default:
        startDate = dayjs().format('YYYY-MM-DD');
        endDate = dayjs().format('YYYY-MM-DD');
        break;
    }

    onChange(startDate, endDate);
  };

  return (
    <Select 
      defaultValue={defaultValue} 
      size="small" 
      style={style}
      className={className}
      onChange={handleChange}
    >
      <Select.Option value="today">{t('filter.today', 'Hôm nay')}</Select.Option>
      <Select.Option value="yesterday">{t('filter.yesterday', 'Hôm qua')}</Select.Option>
      <Select.Option value="thisWeek">{t('filter.thisWeek', 'Tuần này')}</Select.Option>
      <Select.Option value="last30Days">{t('filter.last30Days', '30 ngày qua')}</Select.Option>
      <Select.Option value="thisMonth">{t('filter.thisMonth', 'Tháng này')}</Select.Option>
      <Select.Option value="lastMonth">{t('filter.lastMonth', 'Tháng trước')}</Select.Option>
    </Select>
  );
};
