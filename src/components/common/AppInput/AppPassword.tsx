import React from 'react';
import { Input, Form } from 'antd';
import type { PasswordProps } from 'antd/es/input';

interface AppPasswordProps extends PasswordProps {
  label?: string;
  name?: string;
  rules?: any[];
  regex?: RegExp;
  regexMessage?: string;
}

export const AppPassword: React.FC<AppPasswordProps> = ({
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
      message: regexMessage,
    });
  }

  return (
    <Form.Item label={label} name={name} rules={combinedRules}>
      <Input.Password size="large" {...props} />
    </Form.Item>
  );
};
