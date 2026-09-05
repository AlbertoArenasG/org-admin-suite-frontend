'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { useDashboardShellScrollMode } from '@/components/dashboard-shell/DashboardShellContext';
import { cn } from '@/lib/utils';

type DashboardPageContentScrollerProps = ComponentPropsWithoutRef<'div'> & {
  padding?: 'none' | 'default';
};

export function DashboardPageContentScroller({
  children,
  className,
  padding = 'none',
  ...props
}: DashboardPageContentScrollerProps) {
  const scrollMode = useDashboardShellScrollMode();

  return (
    <div
      data-dashboard-page-content={scrollMode}
      data-dashboard-page-content-padding={padding}
      data-dashboard-scroll-owner={scrollMode === 'page-content' ? 'page-content' : undefined}
      className={cn(
        'dashboard-page-content-scroller',
        scrollMode === 'page-content'
          ? 'min-h-0 flex-1 md:overscroll-y-none md:overflow-y-auto'
          : 'min-w-0 shrink-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
