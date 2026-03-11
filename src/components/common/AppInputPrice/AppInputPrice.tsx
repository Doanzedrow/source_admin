import React, { useCallback } from 'react';
import { InputNumber, Form, Space } from 'antd';
import type { InputNumberProps } from 'antd';

interface AppInputPriceProps extends Omit<InputNumberProps, 'name' | 'formatter' | 'parser'> {
  label?: string;
  name?: string | (string | number)[];
  rules?: any[];
  currency?: string;
  id?: string;
}

const ALLOWED_KEYS = new Set([
  'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
  'Home', 'End',
]);

const formatter = (value: number | string | undefined): string => {
  if (value === undefined || value === null || value === '') return '';
  const num = Number(`${value}`.replace(/,/g, ''));
  if (isNaN(num)) return '';
  return num.toLocaleString('vi-VN');
};

const parser = (value: string | undefined): string => {
  if (!value) return '';
  return value.replace(/\./g, '').replace(/,/g, '');
};

export const AppInputPrice: React.FC<AppInputPriceProps> = ({
  label,
  name,
  rules = [],
  currency = '₫',
  style,
  id,
  ...props
}) => {
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (ALLOWED_KEYS.has(e.key) || e.ctrlKey || e.metaKey) return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  }, []);

  const inputId = id || (typeof name === 'string' ? name : undefined);
  return (
    <Form.Item label={label} name={name} rules={rules} htmlFor={inputId}>
      <Space.Compact style={{ width: '100%', ...style }}>
        <InputNumber
          id={inputId}
          size="large"
          style={{ width: '100%' }}
          formatter={formatter}
          parser={parser}
          min={0}
          step={1000}
          precision={0}
          onKeyDown={handleKeyDown}
          {...props}
        />
        <span className="app-input-price-suffix">{currency}</span>
      </Space.Compact>
    </Form.Item>
  );
};

export default AppInputPrice;
