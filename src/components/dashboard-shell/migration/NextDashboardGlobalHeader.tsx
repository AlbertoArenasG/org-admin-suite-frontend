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
      className="text-foreground"
      start={
        <SidebarTrigger className="size-9 text-foreground hover:bg-muted hover:text-foreground md:flex" />
      }
      end={<DashboardWorkspaceAccountMenu />}
    />
  );
}
