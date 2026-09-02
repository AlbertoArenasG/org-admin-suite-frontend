'use client';

import type { ReactNode } from 'react';
import {
  DashboardShellScrollModeContext,
  type DashboardScrollMode,
} from '@/components/dashboard-shell/DashboardShellContext';
import { DashboardWorkspaceCanvas } from '@/components/dashboard-shell/DashboardWorkspaceCanvas';
import { cn } from '@/lib/utils';

export interface DashboardShellFrameProps {
  globalHeader?: ReactNode;
  workspaceHeader?: ReactNode;
  scrollMode?: DashboardScrollMode;
  children: ReactNode;
  className?: string;
  contentInsetClassName?: string;
  workspaceCanvasClassName?: string;
}

export function DashboardShellFrame({
  globalHeader,
  workspaceHeader,
  scrollMode = 'page-content',
  children,
  className,
  contentInsetClassName,
  workspaceCanvasClassName,
}: DashboardShellFrameProps) {
  return (
    <DashboardShellScrollModeContext.Provider value={scrollMode}>
      <div className={cn('flex min-w-0 flex-1 flex-col md:min-h-0', className)}>
        <div className={cn('flex min-w-0 flex-1 flex-col md:min-h-0', contentInsetClassName)}>
          {globalHeader}
          <DashboardWorkspaceCanvas scrollMode={scrollMode} className={workspaceCanvasClassName}>
            {workspaceHeader}
            {children}
          </DashboardWorkspaceCanvas>
        </div>
      </div>
    </DashboardShellScrollModeContext.Provider>
  );
}
