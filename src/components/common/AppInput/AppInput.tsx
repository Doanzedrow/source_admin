import React from 'react';
import { Input, Form } from 'antd';
import type { InputProps } from 'antd';

interface AppInputProps extends Omit<InputProps, 'name'> {
  label?: string;
  name?: string | (string | number)[];
  rules?: any[];
  regex?: RegExp;
  regexMessage?: string;
  layout?: 'horizontal' | 'vertical' | 'inline';
  noFormItem?: boolean;
  isTextArea?: boolean;
  rows?: number;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  name,
  rules = [],
  regex,
  regexMessage,
  noFormItem = false,
  isTextArea = false,
  rows,
  ...props
}: AppInputProps) => {
  const combinedRules = [{ whitespace: true }, ...rules];

  if (regex) {
    combinedRules.push({
      pattern: regex,
      message: regexMessage,
    });
  }

  const inputId = props.id || (Array.isArray(name) ? name.join('-') : name);

  const inputNode = isTextArea ? (
    <Input.TextArea id={inputId} rows={rows || 4} {...(props as any)} />
  ) : (
    <Input id={inputId} size="large" {...(props as any)} />
  );

  if (noFormItem) {
    return inputNode;
  }

  return (
    <Form.Item
      label={label}
      name={name}
      rules={combinedRules}
      htmlFor={inputId}
      normalize={(value: string) => (typeof value === 'string' ? value.trimStart().replace(/\s{2,}/g, ' ') : value)}
    >
      {inputNode}
    </Form.Item>
  );
};
