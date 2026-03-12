import React, { useState } from 'react';
import { Card as AntdCard, Button } from 'antd';
import type { CardProps } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';

/**
 * AppCard component to unify Card style across the application.
 * Enhanced with optional collapsible functionality.
 */
export interface AppCardProps extends CardProps {
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ 
  children, 
  variant = 'borderless', 
  className = '', 
  collapsible,
  defaultCollapsed = false,
  onCollapse,
  title,
  extra,
  ...props 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [hasRendered, setHasRendered] = useState(!defaultCollapsed);
  const [isPending, startTransition] = React.useTransition();

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isCollapsed;
    
    // Immediate UI feedback for the interaction
    // but the heavy layout shift is deferred
    startTransition(() => {
      if (!nextState && !hasRendered) {
        setHasRendered(true);
      }
      setIsCollapsed(nextState);
    });

    if (onCollapse) onCollapse(nextState);
  };

  const handleHeaderClick = (e: React.MouseEvent) => {
    if (collapsible) {
      toggleCollapse(e);
    }
  };

  const renderExtra = () => {
    if (!collapsible) return extra;
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {extra}
        <Button 
          type="text" 
          size="small" 
          loading={isPending}
          icon={isCollapsed ? <DownOutlined /> : <UpOutlined />} 
          onClick={toggleCollapse}
          className="card-collapse-trigger"
        />
      </div>
    );
  };

  return (
    <AntdCard 
      variant={variant} 
      className={`app-card ${className} ${collapsible ? 'is-collapsible' : ''} ${isCollapsed ? 'is-collapsed' : ''} ${isPending ? 'is-pending' : ''}`} 
      title={
        collapsible ? (
          <div 
            onClick={handleHeaderClick} 
            className="app-card-head-clickable"
            style={{ 
              cursor: 'pointer', 
              margin: '-16px -24px', 
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              width: 'calc(100% + 48px)',
              userSelect: 'none'
            }}
          >
            {title}
          </div>
        ) : title
      }
      extra={renderExtra()}
      styles={{
        // Optimization: When collapsed, we hide the body via CSS instead of unmounting
        // This preserves the state and avoids re-render lag.
        // We use opacity as a transition hint for pending state.
        body: {
          display: isCollapsed ? 'none' : 'block',
          padding: isCollapsed ? 0 : undefined,
          opacity: isPending ? 0.6 : 1,
          transition: 'opacity 0.2s',
        }
      }}
      {...props}
    >
      {hasRendered ? children : null}
    </AntdCard>
  );
};
