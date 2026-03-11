import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import type { InputProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useDebounce } from '@/hooks/useDebounce';

interface AppSearchInputProps extends Omit<InputProps, 'onChange' | 'value'> {
  value?: string;
  onSearch: (value: string) => void;
  debounceTime?: number;
}

export const AppSearchInput: React.FC<AppSearchInputProps> = ({ 
  value = '', 
  onSearch, 
  debounceTime = 500,
  ...props 
}) => {
  const [innerValue, setInnerValue] = useState(value);
  const debouncedValue = useDebounce(innerValue, debounceTime);

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  useEffect(() => {
    if (debouncedValue !== value) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue]);

  return (
    <Input
      {...props}
      value={innerValue}
      onChange={(e) => setInnerValue(e.target.value)}
      prefix={<SearchOutlined style={{ color: 'var(--text-secondary)' }} />}
      allowClear
    />
  );
};
