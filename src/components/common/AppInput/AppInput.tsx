import React from 'react';
import { Input, Form } from 'antd';
import type { InputProps } from 'antd';

interface AppInputProps extends InputProps {
  label?: string;
  name?: string;
  rules?: any[];
  regex?: RegExp;
  regexMessage?: string;
  layout?: 'horizontal' | 'vertical' | 'inline';
}

export const AppInput: React.FC<AppInputProps> = ({ 
  label, 
  name, 
  rules = [], 
  regex, 
  regexMessage, 
  ...props 
}) => {
  const combinedRules = [...rules];
  
  if (regex) {
    combinedRules.push({
      pattern: regex,
      message: regexMessage || 'Định dạng không hợp lệ',
    });
  }

  return (
    <Form.Item label={label} name={name} rules={combinedRules}>
      <Input size="large" {...props} />
    </Form.Item>
  );
};
