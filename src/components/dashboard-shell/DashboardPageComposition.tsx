'use client';

import type { ReactNode } from 'react';
import { useDashboardShellScrollMode } from '@/components/dashboard-shell/DashboardShellContext';
import { cn } from '@/lib/utils';

interface DashboardPageCompositionProps {
  children: ReactNode;
  className?: string;
}

export function DashboardPageComposition({ children, className }: DashboardPageCompositionProps) {
  const scrollMode = useDashboardShellScrollMode();

  return (
    <div
      data-dashboard-page-composition={scrollMode}
      className={cn(
        scrollMode === 'page-content'
          ? 'flex min-h-0 flex-1 flex-col'
          : scrollMode === 'page-composition'
            ? 'min-h-0 flex-1 md:overflow-y-auto'
            : 'min-w-0 shrink-0',
        className
      )}
    >
      {children}
    </div>
  );
}
