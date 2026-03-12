import React from 'react';
import { usePermission } from '@/hooks/usePermission';
import type { PermissionAction } from '@/types';

interface PermissionGateProps {
  module: string;
  action: keyof PermissionAction;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component to conditionally render UI elements based on user permissions.
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  module,
  action,
  children,
  fallback = null,
}) => {
  const { can } = usePermission();

  if (can(module, action)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
