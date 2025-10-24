'use client';

import type { PropsWithChildren } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppSidebar } from '@/components/sidebar/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <AuthGuard>
      <SidebarProvider className="theme-sidebar bg-[color:var(--sidebar)] text-secondary-foreground/90">
        <AppSidebar />
        <SidebarInset className="bg-[color:var(--sidebar)] px-4 pb-5">
          <h1>Dashboard</h1>
          <div className="mx-auto flex w-full flex-1 rounded-[2rem] bg-background/95 p-6 md:p-4">
            <div className="flex w-full flex-1 flex-col gap-6">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
