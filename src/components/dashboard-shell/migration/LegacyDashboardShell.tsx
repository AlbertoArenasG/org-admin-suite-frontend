'use client';

import type { PropsWithChildren } from 'react';
import { AppSidebar } from '@/components/sidebar/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

/**
 * Temporary host for routes that have not adopted the next dashboard shell.
 * Keep this markup behaviorally identical to the previous dashboard layout.
 */
export function LegacyDashboardShell({ children }: PropsWithChildren) {
  return (
    <SidebarProvider className="theme-sidebar bg-[color:var(--sidebar)] text-secondary-foreground/90">
      <AppSidebar />
      <SidebarInset className="bg-[color:var(--sidebar)] px-4 p-5">
        <div className="mx-auto flex w-full flex-1 rounded-[2rem] bg-background/95 p-6 md:p-4">
          <div className="flex w-full flex-1 flex-col gap-6">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
