'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardGlobalHeaderProps {
  start?: ReactNode;
  center?: ReactNode;
  end?: ReactNode;
  className?: string;
}

export function DashboardGlobalHeader({
  start,
  center,
  end,
  className,
}: DashboardGlobalHeaderProps) {
  return (
    <header
      className={cn('flex min-h-14 shrink-0 items-center gap-3 px-1 py-1 sm:px-2', className)}
    >
      <div className="flex shrink-0 items-center gap-2">{start}</div>
      <div className="flex min-w-0 flex-1 items-center justify-center">{center}</div>
      <div className="flex shrink-0 items-center gap-2">{end}</div>
    </header>
  );
}
