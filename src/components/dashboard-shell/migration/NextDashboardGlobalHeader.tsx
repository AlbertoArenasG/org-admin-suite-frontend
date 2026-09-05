'use client';

import { Bell } from 'lucide-react';
import { DashboardWorkspaceToolbar } from '@/components/dashboard-shell/DashboardWorkspaceToolbar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
  );
}
