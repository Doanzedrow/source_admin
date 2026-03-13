import React, { useState } from 'react';
import { Space, DatePicker, Radio } from 'antd';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export interface OrderDateFilterProps {
  onChange: (startDate?: string, endDate?: string) => void;
  defaultValue?: string;
}

export const OrderDateFilter: React.FC<OrderDateFilterProps> = ({ onChange, defaultValue = 'today' }) => {
  const { t } = useTranslation(['dashboard', 'translation', 'order']);
  const [value, setValue] = useState<string>(defaultValue);

  const handlePresetChange = (e: any) => {
    const val = e.target.value;
    setValue(val);
    
    if (val === 'custom') {
      return;
    }

    let startDate = dayjs().format('YYYY-MM-DD');
    let endDate = dayjs().format('YYYY-MM-DD');

    switch (val) {
      case 'yesterday':
        startDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
        endDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
        break;
      case 'thisWeek':
        startDate = dayjs().startOf('week').format('YYYY-MM-DD');
        endDate = dayjs().endOf('week').format('YYYY-MM-DD');
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

  const handleRangeChange = (values: any) => {
    if (values && values[0] && values[1]) {
      onChange(values[0].format('YYYY-MM-DD'), values[1].format('YYYY-MM-DD'));
    } else {
      onChange(undefined, undefined);
    }
  };

  return (
    <Space wrap size="middle">
      <Radio.Group 
        value={value} 
        onChange={handlePresetChange} 
        optionType="button" 
        buttonStyle="solid"
      >
        <Radio.Button value="today">{t('filter.today', 'Hôm nay')}</Radio.Button>
        <Radio.Button value="yesterday">{t('filter.yesterday', 'Hôm qua')}</Radio.Button>
        <Radio.Button value="thisWeek">{t('filter.thisWeek', 'Tuần này')}</Radio.Button>
        <Radio.Button value="thisMonth">{t('filter.thisMonth', 'Tháng này')}</Radio.Button>
        <Radio.Button value="lastMonth">{t('filter.lastMonth', 'Tháng trước')}</Radio.Button>
        <Radio.Button value="custom">{t('order:filter.custom', 'Tùy chỉnh')}</Radio.Button>
      </Radio.Group>
      
      {value === 'custom' && (
        <RangePicker 
          onChange={handleRangeChange}
          format="YYYY-MM-DD"
          allowClear
          style={{ width: 280 }}
        />
      )}
    </Space>
  );
};
