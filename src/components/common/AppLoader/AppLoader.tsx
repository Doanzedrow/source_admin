import React from 'react';
import { Spin } from 'antd';
import './AppLoader.less';

interface AppLoaderProps {
  isLoading?: boolean;
  tip?: string;
  overlay?: boolean;
  className?: string;
}

export const AppLoader: React.FC<AppLoaderProps> = ({ 
  isLoading = true, 
  tip, 
  overlay = false,
  className = ''
}) => {
  if (!isLoading) return null;

  return (
    <div className={`app-loader-container ${overlay ? 'overlay' : ''} ${className}`}>
      <Spin size="large" tip={tip} />
    </div>
  );
};
