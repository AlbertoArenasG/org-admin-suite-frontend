'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardWorkspaceHeaderProps {
  children: ReactNode;
  className?: string;
}

export function DashboardWorkspaceHeader({ children, className }: DashboardWorkspaceHeaderProps) {
  return (
    <header className={cn('flex min-h-12 shrink-0 items-center px-1 py-1 sm:px-2', className)}>
      <div className="min-w-0 flex-1">{children}</div>
    </header>
  );
}
