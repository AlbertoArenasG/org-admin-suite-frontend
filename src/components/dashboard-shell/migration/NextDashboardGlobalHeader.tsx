'use client';

import { DashboardWorkspaceToolbar } from '@/components/dashboard-shell/DashboardWorkspaceToolbar';
import { DashboardWorkspaceAccountMenu } from '@/components/dashboard-shell/DashboardWorkspaceAccountMenu';
import { SidebarTrigger } from '@/components/ui/sidebar';

/**
 * Global utilities for every route hosted by NextDashboardShell.
 * It is intentionally inside the workspace canvas; route context remains in
 * the Workspace Header rendered immediately below it.
 */
export function NextDashboardGlobalHeader() {
  return (
    <DashboardWorkspaceToolbar
      className="text-[var(--workspace-chrome-foreground)]"
      start={
        <SidebarTrigger className="dashboard-workspace-chrome-control size-9 text-[var(--workspace-chrome-foreground)] hover:bg-[var(--workspace-chrome-control-hover)] hover:text-[var(--workspace-chrome-foreground)] md:flex" />
      }
      end={<DashboardWorkspaceAccountMenu />}
    />
  );
}
