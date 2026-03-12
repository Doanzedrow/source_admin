import React from 'react';
import { Button } from 'antd';
import type { ButtonProps } from 'antd';

interface AppButtonProps extends ButtonProps {
  label?: string;
}

export const AppButton: React.FC<AppButtonProps> = ({ label, children, ...props }) => {
  return (
    <Button {...props}>
      {label || children}
    </Button>
  );
};
