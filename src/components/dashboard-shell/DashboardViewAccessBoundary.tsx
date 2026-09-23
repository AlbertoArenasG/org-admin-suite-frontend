'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { useAuthorization } from '@/features/auth';
import type { AuthPermissionAccess } from '@/features/auth/types';

type DashboardViewModule = AuthPermissionAccess['module'];
type DashboardViewOperation = AuthPermissionAccess['operation'];

interface DashboardViewAccessContextValue {
  module: DashboardViewModule;
  can: (operation: DashboardViewOperation) => boolean;
}

interface DashboardViewAccessBoundaryProps extends PropsWithChildren {
  module: DashboardViewModule;
  requiredOperation: DashboardViewOperation;
}

const DashboardViewAccessContext = createContext<DashboardViewAccessContextValue | null>(null);

export function DashboardViewAccessBoundary({
  children,
  module,
  requiredOperation,
}: DashboardViewAccessBoundaryProps) {
  const router = useRouter();
  const { hasPermission } = useAuthorization();
  const redirectedRef = useRef(false);
  const canAccess = hasPermission(module, requiredOperation);

  useEffect(() => {
    if (canAccess || redirectedRef.current) return;

    redirectedRef.current = true;
    router.replace('/dashboard');
  }, [canAccess, router]);

  if (!canAccess) return null;

  return (
    <DashboardViewAccessContext.Provider
      value={{ module, can: (operation) => hasPermission(module, operation) }}
    >
      {children}
    </DashboardViewAccessContext.Provider>
  );
}

export function useDashboardViewAccess(): DashboardViewAccessContextValue {
  const context = useContext(DashboardViewAccessContext);

  if (!context) {
    throw new Error('useDashboardViewAccess must be used within a DashboardViewAccessBoundary.');
  }

  return context;
}
