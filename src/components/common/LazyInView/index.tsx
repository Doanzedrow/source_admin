import React, { type ReactNode, type CSSProperties } from 'react';
import { Spin } from 'antd';
import { useInView } from '@/hooks/useInView';

export interface LazyInViewProps {
  children: ReactNode;
  minHeight?: number | string;
  fallback?: ReactNode;
  rootMargin?: string;
  className?: string;
  style?: CSSProperties;
}

export const LazyInView: React.FC<LazyInViewProps> = ({ 
  children, 
  minHeight, 
  fallback,
  rootMargin = '200px 0px', 
  className,
  style
}) => {
  const { ref, isInView } = useInView({ triggerOnce: true, rootMargin });

  return (
    <div ref={ref} style={{ minHeight: minHeight || undefined, width: '100%', ...style }} className={className}>
      {isInView ? (
        children
      ) : (
        fallback || (
          <div 
            style={{ 
              height: minHeight || 400, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              background: 'var(--body-bg)', 
              borderRadius: 'var(--border-radius-lg)'
            }}
          >
            <Spin size="large" />
          </div>
        )
      )}
    </div>
  );
};
