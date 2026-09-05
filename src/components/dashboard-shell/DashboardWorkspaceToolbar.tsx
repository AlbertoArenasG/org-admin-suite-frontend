'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardWorkspaceToolbarProps {
  start?: ReactNode;
  center?: ReactNode;
  end?: ReactNode;
  className?: string;
}

/**
 * Utility bar owned by the workspace canvas. It remains separate from the
 * workspace header so breadcrumbs and page context can occupy their own row.
 */
export function DashboardWorkspaceToolbar({
  start,
  center,
  end,
  className,
}: DashboardWorkspaceToolbarProps) {
  return (
    <header
      className={cn(
        'flex min-h-16 shrink-0 items-center gap-3 border-b border-border/70 px-4 sm:px-5',
        className
      )}
    >
      <div className="flex shrink-0 items-center gap-2">{start}</div>
      <div className="flex min-w-0 flex-1 items-center justify-center">{center}</div>
      <div className="flex shrink-0 items-center gap-2">{end}</div>
    </header>
  );
}
