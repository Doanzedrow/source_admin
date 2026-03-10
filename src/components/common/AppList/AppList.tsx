import React from 'react';
import { Flex } from 'antd';
import type { FlexProps } from 'antd';

interface AppListProps<T> extends Omit<FlexProps, 'children'> {
  dataSource: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  loading?: boolean;
}

/**
 * AppList component to replace deprecated Antd List.
 * Uses Flexbox for modern layout.
 */
export function AppList<T>({ 
  dataSource, 
  renderItem, 
  loading, 
  className = '', 
  vertical = true,
  gap = 0,
  ...props 
}: AppListProps<T>) {
  if (loading && dataSource.length === 0) {
    return null; // Or a skeleton
  }

  return (
    <Flex 
      className={`app-list ${className}`} 
      vertical={vertical} 
      gap={gap}
      {...props}
    >
      {dataSource.map((item, index) => (
        <React.Fragment key={index}>
          {renderItem(item, index)}
        </React.Fragment>
      ))}
    </Flex>
  );
}
