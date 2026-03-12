import React from 'react';
import { Skeleton, Flex } from 'antd';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  compact?: boolean;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ 
  rows = 5, 
  columns = 5,
  compact = false
}) => {
  return (
    <div className="table-skeleton-wrapper" style={{ padding: compact ? '8px 0' : '16px' }}>
      <Flex vertical gap={compact ? 8 : 12}>
        {/* Fake Header */}
        <Flex gap={8} style={{ marginBottom: 4 }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton.Button 
              key={`h-${i}`} 
              active 
              size="small" 
              style={{ flex: 1, height: compact ? 24 : 32, borderRadius: 4 }} 
            />
          ))}
        </Flex>
        
        {/* Fake Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <Flex key={`r-${i}`} gap={8}>
            {Array.from({ length: columns }).map((_, j) => (
              <Skeleton.Input 
                key={`c-${j}`} 
                active 
                size="small" 
                style={{ flex: 1, height: compact ? 32 : 48, borderRadius: 4 }} 
              />
            ))}
          </Flex>
        ))}
      </Flex>
    </div>
  );
};
