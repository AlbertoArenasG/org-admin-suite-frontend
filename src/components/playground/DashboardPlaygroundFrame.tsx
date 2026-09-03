'use client';

import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { Bell } from 'lucide-react';
import {
  DashboardGlobalHeader,
  DashboardPageComposition,
  DashboardPageContentScroller,
  DashboardShellFrame,
  type DashboardScrollMode,
  DashboardWorkspaceHeader,
} from '@/components/dashboard-shell';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { PageBreadcrumbs, type BreadcrumbSegment } from '@/components/shared/PageBreadcrumbs';

interface DashboardPlaygroundFrameProps {
  segments: BreadcrumbSegment[];
  children: ReactNode;
  scrollMode?: DashboardScrollMode;
  childrenArePageComposition?: boolean;
  pageCompositionProps?: Omit<ComponentPropsWithoutRef<'div'>, 'children'>;
  pageCompositionRef?: Ref<HTMLDivElement>;
}

export function DashboardPlaygroundFrame({
  segments,
  children,
  scrollMode,
  childrenArePageComposition = false,
  pageCompositionProps,
  pageCompositionRef,
}: DashboardPlaygroundFrameProps) {
  return (
    <DashboardShellFrame
      scrollMode={scrollMode}
      className="min-h-svh md:h-full md:min-h-0"
      contentInsetClassName="dashboard-content-inset md:min-h-0 md:p-4"
      workspaceCanvasClassName="rounded-none shadow-none md:rounded-[1.5rem] md:shadow-sm"
      globalHeader={
        <DashboardGlobalHeader
          className="text-sidebar-foreground"
          start={
            <SidebarTrigger className="size-9 text-sidebar-foreground hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground md:flex" />
          }
          end={
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Notificaciones de ejemplo"
                className="size-9 text-sidebar-foreground hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground"
              >
                <Bell className="size-4" aria-hidden="true" />
              </Button>
              <Avatar className="size-7 border border-sidebar-foreground/20">
                <AvatarFallback className="bg-sidebar-foreground/10 text-[10px] font-semibold text-sidebar-foreground">
                  AA
                </AvatarFallback>
              </Avatar>
            </>
          }
        />
      }
      workspaceHeader={
        <DashboardWorkspaceHeader className="border-b border-border/70 px-4 sm:px-5">
          <PageBreadcrumbs segments={segments} />
        </DashboardWorkspaceHeader>
      }
    >
      <DashboardPageComposition ref={pageCompositionRef} {...pageCompositionProps}>
        {childrenArePageComposition ? (
          children
        ) : (
          <DashboardPageContentScroller className="px-5 py-5 sm:px-7">
            {children}
          </DashboardPageContentScroller>
        )}
      </DashboardPageComposition>
    </DashboardShellFrame>
  );
}
