'use client';

import type { ReactNode } from 'react';
import { useDashboardShellScrollMode } from '@/components/dashboard-shell/DashboardShellContext';
import { cn } from '@/lib/utils';

interface DashboardPageContentScrollerProps {
  children: ReactNode;
  className?: string;
}

export function DashboardPageContentScroller({
  children,
  className,
}: DashboardPageContentScrollerProps) {
  const scrollMode = useDashboardShellScrollMode();

  return (
    <div
      data-dashboard-page-content={scrollMode}
      className={cn(
        scrollMode === 'page-content'
          ? 'min-h-0 flex-1 md:overscroll-y-none md:overflow-y-auto'
          : 'min-w-0 shrink-0',
        className
      )}
    >
      {children}
    </div>
  );
}
