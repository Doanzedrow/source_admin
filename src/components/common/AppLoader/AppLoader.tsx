import React from 'react';
import { Spin } from 'antd';
import './AppLoader.less';

interface AppLoaderProps {
  isLoading?: boolean;
  tip?: string;
  description?: string;
  overlay?: boolean;
  className?: string;
}

export const AppLoader: React.FC<AppLoaderProps> = ({ 
  isLoading = true, 
  tip,
  description, 
  overlay = false,
  className = ''
}) => {
  if (!isLoading) return null;

  const content = description || tip;

  return (
    <div className={`app-loader-container ${overlay ? 'overlay' : ''} ${className}`}>
      <Spin size="large" description={content} />
    </div>
  );
};
