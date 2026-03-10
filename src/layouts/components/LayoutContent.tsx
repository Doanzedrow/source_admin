import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

interface LayoutContentProps {
  children: React.ReactNode;
}

export const LayoutContent: React.FC<LayoutContentProps> = ({ children }) => {
  return (
    <Content className="layout-content">
      {children}
    </Content>
  );
};
