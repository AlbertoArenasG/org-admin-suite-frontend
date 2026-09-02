'use client';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { useDashboardShellScrollMode } from '@/components/dashboard-shell/DashboardShellContext';
import { cn } from '@/lib/utils';

type DashboardPageCompositionProps = ComponentPropsWithoutRef<'div'>;

export const DashboardPageComposition = forwardRef<HTMLDivElement, DashboardPageCompositionProps>(
  ({ children, className, ...props }, ref) => {
    const scrollMode = useDashboardShellScrollMode();

    return (
      <div
        ref={ref}
        data-dashboard-page-composition={scrollMode}
        className={cn(
          scrollMode === 'page-content'
            ? 'flex min-h-0 flex-1 flex-col'
            : scrollMode === 'page-composition'
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
);

DashboardPageComposition.displayName = 'DashboardPageComposition';
