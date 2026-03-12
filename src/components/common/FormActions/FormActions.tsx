import React from 'react';
import { Flex } from 'antd';
import './FormActions.less';

interface FormActionsProps {
  children: React.ReactNode;
  justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around';
  className?: string;
  isSticky?: boolean;
  style?: React.CSSProperties;
}

export const FormActions: React.FC<FormActionsProps> = ({
  children,
  justify = 'end',
  className = '',
  isSticky = true,
  style,
}) => {
  return (
    <div className={`form-actions-wrapper ${isSticky ? 'is-sticky' : ''} ${className}`} style={style}>
      <Flex justify={justify} gap={12} className="form-actions-content">
        {children}
      </Flex>
    </div>
  );
};

export default FormActions;
