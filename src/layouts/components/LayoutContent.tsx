import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

interface LayoutContentProps {
  children: React.ReactNode;
}

export const LayoutContent: React.FC<LayoutContentProps> = ({ children }) => {
  return (
    <div className="layout-content-wrapper">
      <Content className="layout-content">
        {children}
      </Content>
    </div>
  );
};
