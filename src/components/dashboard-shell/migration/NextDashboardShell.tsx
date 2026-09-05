'use client';

import type { PropsWithChildren } from 'react';
import { DashboardShellFrame, DashboardWorkspaceHeader } from '@/components/dashboard-shell';
import { NextDashboardGlobalHeader } from '@/components/dashboard-shell/migration/NextDashboardGlobalHeader';
import type { NextDashboardShellRouteConfig } from '@/components/dashboard-shell/migration/dashboardShellMigration';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { AppSidebar } from '@/components/sidebar/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

interface NextDashboardShellProps extends PropsWithChildren {
  config: NextDashboardShellRouteConfig;
}

/**
 * Shared host for routes explicitly adopted into the next dashboard shell.
 * Route-specific content remains in children and in the route configuration.
 */
export function NextDashboardShell({ children, config }: NextDashboardShellProps) {
  return (
    <SidebarProvider className="theme-sidebar dashboard-shell min-h-svh text-[var(--foreground)] md:h-svh md:min-h-0 md:overscroll-y-none md:overflow-hidden">
      <AppSidebar />
      <SidebarInset className="min-h-svh bg-transparent p-0 md:h-svh md:min-h-0 md:overscroll-y-none md:overflow-hidden">
        <DashboardShellFrame
          scrollMode={config.scrollMode}
          className="min-h-svh md:h-full md:min-h-0"
          contentInsetClassName="dashboard-content-inset md:min-h-0 md:p-4"
          workspaceToolbar={<NextDashboardGlobalHeader />}
          workspaceHeader={
            <DashboardWorkspaceHeader className="px-4 sm:px-5">
              <PageBreadcrumbs segments={config.breadcrumbs} />
            </DashboardWorkspaceHeader>
          }
        >
          {children}
        </DashboardShellFrame>
      </SidebarInset>
    </SidebarProvider>
  );
}
