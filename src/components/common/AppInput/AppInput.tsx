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
  const combinedRules = [{ whitespace: true }, ...rules];

  if (regex) {
    combinedRules.push({
      pattern: regex,
      message: regexMessage,
    });
  }

  const inputId = props.id || name;

  return (
    <Form.Item
      label={label}
      name={name}
      rules={combinedRules}
      htmlFor={inputId}
      normalize={(value: string) => value?.trimStart().replace(/\s{2,}/g, ' ')}
    >
      <Input id={inputId} size="large" {...props} />
    </Form.Item>
  );
};
