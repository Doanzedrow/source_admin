import React, { useState, useMemo } from 'react';
import { Space, DatePicker, Radio, Select, Flex } from 'antd';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export interface OrderDateFilterProps {
  onChange: (startDate?: string, endDate?: string, startHour?: string, endHour?: string) => void;
  defaultValue?: string;
}

export const OrderDateFilter: React.FC<OrderDateFilterProps> = ({ onChange, defaultValue = 'today' }) => {
  const { t } = useTranslation(['dashboard', 'translation', 'order']);
  const [value, setValue] = useState<string>(defaultValue);
  const [dates, setDates] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([dayjs(), dayjs()]);
  const [startHour, setStartHour] = useState<string>('05');
  const [endHour, setEndHour] = useState<string>('22');

  const hourOptions = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, '0');
      return { label: `${hour}:00`, value: hour };
    });
  }, []);

  const triggerChange = (
    newDates: [dayjs.Dayjs | null, dayjs.Dayjs | null], 
    sHour: string, 
    eHour: string
  ) => {
    if (!newDates[0] || !newDates[1]) {
      onChange(undefined, undefined, undefined, undefined);
      return;
    }

    const startDateStr = newDates[0].format('YYYY-MM-DD');
    const endDateStr = newDates[1].format('YYYY-MM-DD');

    onChange(startDateStr, endDateStr, `${sHour}:00`, `${eHour}:00`);
  };

  const handlePresetChange = (e: any) => {
    const val = e.target.value;
    setValue(val);
    
    if (val === 'custom') {
      return;
    }

    let start = dayjs();
    let end = dayjs();

    switch (val) {
      case 'yesterday':
        start = dayjs().subtract(1, 'day');
        end = dayjs().subtract(1, 'day');
        break;
      case 'thisWeek':
        start = dayjs().startOf('week');
        end = dayjs().endOf('week');
        break;
      case 'thisMonth':
        start = dayjs().startOf('month');
        end = dayjs().endOf('month');
        break;
      case 'lastMonth':
        start = dayjs().subtract(1, 'month').startOf('month');
        end = dayjs().subtract(1, 'month').endOf('month');
        break;
      case 'today':
      default:
        start = dayjs();
        end = dayjs();
        break;
    }
    
    const newDates: [dayjs.Dayjs, dayjs.Dayjs] = [start, end];
    setDates(newDates);
    triggerChange(newDates, startHour, endHour);
  };

  const handleRangeChange = (values: any) => {
    const newDates: [dayjs.Dayjs | null, dayjs.Dayjs | null] = values ? [values[0], values[1]] : [null, null];
    setDates(newDates);
    triggerChange(newDates, startHour, endHour);
  };

  const handleStartHourChange = (val: string) => {
    setStartHour(val);
    triggerChange(dates, val, endHour);
  };

  const handleEndHourChange = (val: string) => {
    setEndHour(val);
    triggerChange(dates, startHour, val);
  };

  return (
    <Space wrap size={16} align="center">
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
      
      <Flex gap={8} align="center">
        <Select 
          value={startHour} 
          options={hourOptions} 
          onChange={handleStartHourChange}
          style={{ width: 85 }}
          placeholder={t('order:filter.startTime')}
        />
        <span>-</span>
        <Select 
          value={endHour} 
          options={hourOptions} 
          onChange={handleEndHourChange}
          style={{ width: 85 }}
          placeholder={t('order:filter.endTime')}
        />
      </Flex>
      
      {value === 'custom' && (
        <RangePicker 
          onChange={handleRangeChange}
          format="YYYY-MM-DD"
          allowClear
          style={{ width: 250 }}
        />
      )}
    </Space>
  );
};
