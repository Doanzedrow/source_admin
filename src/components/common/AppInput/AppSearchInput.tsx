import React, { useState, useEffect, memo, useRef, useTransition } from 'react';
import { Input } from 'antd';
import type { InputProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface AppSearchInputProps extends Omit<InputProps, 'onChange' | 'value'> {
  value?: string;
  onSearch: (value: string) => void;
  debounceTime?: number;
}

const AppSearchInputComponent: React.FC<AppSearchInputProps> = ({ 
  value = '', 
  onSearch, 
  debounceTime = 400, 
  ...props 
}) => {
  const [innerValue, setInnerValue] = useState(value);
  const [isPending, startTransition] = useTransition();
  const lastValueRef = useRef(value);

  
  useEffect(() => {
    if (value !== lastValueRef.current) {
      setInnerValue(value);
      lastValueRef.current = value;
    }
  }, [value]);

  useEffect(() => {
    
    if (innerValue === lastValueRef.current) return;

    const timer = setTimeout(() => {
      lastValueRef.current = innerValue;
      
      startTransition(() => {
        onSearch(innerValue);
      });
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [innerValue, onSearch, debounceTime]);

  return (
    <Input
      {...props}
      value={innerValue}
      onChange={(e) => setInnerValue(e.target.value)}
      prefix={
        <SearchOutlined 
          style={{ 
            color: isPending ? 'var(--primary-color)' : 'var(--text-secondary)',
            transition: 'color 0.3s'
          }} 
        />
      }
      allowClear
      className={isPending ? 'input-searching' : ''}
      style={{
        ...props.style,
        borderColor: isPending ? 'var(--primary-color)' : undefined,
        boxShadow: isPending ? '0 0 0 2px rgba(24, 144, 255, 0.1)' : undefined
      }}
    />
  );
};

export const AppSearchInput = memo(AppSearchInputComponent);
