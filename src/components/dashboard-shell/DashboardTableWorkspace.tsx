'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { DashboardPageComposition } from '@/components/dashboard-shell/DashboardPageComposition';
import { DashboardPageContentScroller } from '@/components/dashboard-shell/DashboardPageContentScroller';
import { cn } from '@/lib/utils';

type DashboardTableWorkspaceProps = ComponentPropsWithoutRef<'div'> & {
  padding?: 'none' | 'default';
  contentClassName?: string;
};

/**
 * Establishes the table-workspace scroll boundary. The DataTable owns vertical
 * scrolling on desktop; mobile falls back to normal page flow.
 */
export function DashboardTableWorkspace({
  children,
  className,
  contentClassName,
  padding = 'default',
  ...props
}: DashboardTableWorkspaceProps) {
  return (
    <DashboardPageComposition className={className} {...props}>
      <DashboardPageContentScroller padding={padding}>
        <div className={cn('flex min-h-0 w-full flex-1 flex-col', contentClassName)}>
          {children}
        </div>
      </DashboardPageContentScroller>
    </DashboardPageComposition>
  );
}
