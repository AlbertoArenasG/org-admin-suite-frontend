'use client';

import type { ReactNode } from 'react';
import { PageBreadcrumbs, type BreadcrumbSegment } from '@/components/shared/PageBreadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface DashboardPageHeaderProps {
  segments: BreadcrumbSegment[];
  actions?: ReactNode;
  className?: string;
  breadcrumbsClassName?: string;
  breadcrumbsListClassName?: string;
}

export function DashboardPageHeader({
  segments,
  actions,
  className,
  breadcrumbsClassName,
  breadcrumbsListClassName,
}: DashboardPageHeaderProps) {
  return (
    <header
      className={cn(
        'flex h-16 items-center justify-between gap-3 rounded-3xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12',
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <span aria-hidden="true" className="mr-2 h-4 w-px shrink-0" />
        <PageBreadcrumbs
          segments={segments}
          className={breadcrumbsClassName}
          listClassName={breadcrumbsListClassName}
        />
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}
