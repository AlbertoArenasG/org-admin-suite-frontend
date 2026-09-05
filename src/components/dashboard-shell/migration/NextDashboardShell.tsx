'use client';

import type { PropsWithChildren } from 'react';
import { Bell } from 'lucide-react';
import {
  DashboardShellFrame,
  DashboardWorkspaceHeader,
  DashboardWorkspaceToolbar,
} from '@/components/dashboard-shell';
import type { NextDashboardShellRouteConfig } from '@/components/dashboard-shell/migration/dashboardShellMigration';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { AppSidebar } from '@/components/sidebar/AppSidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

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
          workspaceToolbar={
            <DashboardWorkspaceToolbar
              className="text-foreground"
              start={
                <SidebarTrigger className="size-9 text-foreground hover:bg-muted hover:text-foreground md:flex" />
              }
              end={
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Notificaciones"
                    className="size-9 text-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Bell className="size-4" aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Cuenta"
                    className="size-9 text-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Avatar className="size-7 border border-border">
                      <AvatarFallback className="bg-muted text-[10px] font-semibold text-foreground">
                        AA
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </>
              }
            />
          }
          workspaceHeader={
            <DashboardWorkspaceHeader className="border-b border-border/70 px-4 sm:px-5">
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
