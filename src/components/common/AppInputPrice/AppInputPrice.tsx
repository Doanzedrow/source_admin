import React, { useCallback } from 'react';
import { InputNumber, Form } from 'antd';
import type { InputNumberProps } from 'antd';

interface AppInputPriceProps extends Omit<InputNumberProps, 'name' | 'formatter' | 'parser'> {
  label?: string;
  name?: string | (string | number)[];
  rules?: any[];
  currency?: string;
  id?: string;
  isListField?: boolean;
  fieldKey?: number;
  noStyle?: boolean;
}

const ALLOWED_KEYS = new Set([
  'Backspace',
  'Delete',
  'Tab',
  'Escape',
  'Enter',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
]);

const numberFormatter = new Intl.NumberFormat('vi-VN');

const formatter = (value: number | string | undefined): string => {
  if (value === undefined || value === null || value === '') return '';
  const strValue = `${value}`.replace(/\D/g, '');
  const num = Number(strValue);
  if (isNaN(num)) return '';
  return numberFormatter.format(num);
};

const parser = (value: string | undefined): number => {
  if (!value) return 0;
  const cleanValue = value.replace(/\D/g, '');
  return cleanValue ? parseInt(cleanValue, 10) : 0;
};

export const AppInputPrice: React.FC<AppInputPriceProps> = ({
  label,
  name,
  rules = [],
  currency = '₫',
  style,
  id,
  // Desctructure list-related props to prevent them from being passed to InputNumber
  isListField,
  fieldKey,
  noStyle,
  ...props
}) => {
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (ALLOWED_KEYS.has(e.key) || e.ctrlKey || e.metaKey) return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  }, []);

  const inputId = id || (typeof name === 'string' ? name : undefined);
  
  return (
    <Form.Item 
      label={label} 
      name={name} 
      rules={rules} 
      htmlFor={inputId} 
      isListField={isListField}
      noStyle={noStyle}
    >
      <InputNumber
        id={inputId}
        size="large"
        style={{ width: '100%', ...style }}
        formatter={formatter}
        parser={parser as any}
        min={0}
        step={1000}
        precision={0}
        onKeyDown={handleKeyDown}
        controls={false}
        className="app-input-right"
        suffix={currency} 
        {...props}
      />
    </Form.Item>
  );
};

export default AppInputPrice;
