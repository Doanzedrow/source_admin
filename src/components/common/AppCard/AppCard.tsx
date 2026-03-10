import { Card as AntdCard } from 'antd';
import type { CardProps } from 'antd';

/**
 * AppCard component to unify Card style across the application.
 */
export const AppCard: React.FC<CardProps> = ({ 
  children, 
  variant = 'borderless', 
  className = '', 
  ...props 
}) => {
  return (
    <AntdCard 
      variant={variant} 
      className={`app-card ${className}`} 
      {...props}
    >
      {children}
    </AntdCard>
  );
};
