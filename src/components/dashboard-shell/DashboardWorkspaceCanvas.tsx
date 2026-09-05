'use client';

import type { ReactNode } from 'react';
import type { DashboardScrollMode } from '@/components/dashboard-shell/DashboardShellContext';
import { cn } from '@/lib/utils';

interface DashboardWorkspaceCanvasProps {
  scrollMode: DashboardScrollMode;
  children: ReactNode;
  className?: string;
}

export function DashboardWorkspaceCanvas({
  scrollMode,
  children,
  className,
}: DashboardWorkspaceCanvasProps) {
  return (
    <section
      data-dashboard-scroll-mode={scrollMode}
      data-dashboard-scroll-owner={scrollMode === 'workspace' ? 'workspace-canvas' : undefined}
      className={cn(
        'dashboard-workspace-canvas flex min-w-0 flex-1 flex-col',
        scrollMode === 'workspace'
          ? 'md:min-h-0 md:overscroll-none md:overflow-y-auto'
          : 'md:min-h-0 md:overflow-hidden',
        className
      )}
    >
      {children}
    </section>
  );
}
