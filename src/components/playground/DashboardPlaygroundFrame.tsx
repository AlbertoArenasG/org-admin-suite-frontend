'use client';

import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import {
  DashboardPageComposition,
  DashboardPageContentScroller,
  DashboardShellFrame,
  type DashboardScrollMode,
  DashboardWorkspaceHeader,
  DashboardWorkspaceAccountMenu,
  DashboardWorkspaceToolbar,
} from '@/components/dashboard-shell';
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
      workspaceToolbar={
        <DashboardWorkspaceToolbar
          className="text-foreground"
          start={
            <SidebarTrigger className="size-9 text-foreground hover:bg-muted hover:text-foreground md:flex" />
          }
          end={<DashboardWorkspaceAccountMenu />}
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
