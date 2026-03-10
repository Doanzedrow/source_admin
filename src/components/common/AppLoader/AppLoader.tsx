import React from 'react';
import { Spin } from 'antd';
import './AppLoader.less';

export const AppLoader: React.FC = () => {
  return (
    <div className="app-loader-container">
      <Spin size="large" />
    </div>
  );
};
