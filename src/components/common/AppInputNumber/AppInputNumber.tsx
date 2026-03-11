import React, { useCallback } from 'react';
import { InputNumber, Form } from 'antd';
import type { InputNumberProps } from 'antd';

interface AppInputNumberProps extends Omit<InputNumberProps, 'name' | 'formatter' | 'parser'> {
  label?: string;
  name?: string | (string | number)[];
  rules?: any[];
  placeholder?: string;
  id?: string;
}

const ALLOWED_KEYS = new Set([
  'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
  'Home', 'End',
]);

const numberFormatter = new Intl.NumberFormat('vi-VN');

const formatter = (value: number | string | undefined): string => {
  if (value === undefined || value === null || value === '') return '';
  const num = typeof value === 'number' ? value : Number(`${value}`.replace(/\./g, ''));
  if (isNaN(num)) return '';
  return numberFormatter.format(num);
};

const parser = (value: string | undefined): string => {
  if (!value) return '';
  return value.replace(/\./g, '');
};

export const AppInputNumber: React.FC<AppInputNumberProps> = ({
  label,
  name,
  rules = [],
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
      <InputNumber
        id={inputId}
        size="large"
        style={{ width: '100%' }}
        precision={0}
        onKeyDown={handleKeyDown}
        formatter={formatter}
        parser={parser}
        controls={false}
        className="app-input-right"
        {...props}
      />
    </Form.Item>
  );
};

export default AppInputNumber;
