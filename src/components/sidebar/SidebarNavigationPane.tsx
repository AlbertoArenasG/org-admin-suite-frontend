'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { ResolvedSidebarNavigationEntry } from '@/components/sidebar/navigation/types';
import { cn } from '@/lib/utils';

type SidebarNavigationPaneProps = {
  entries: ResolvedSidebarNavigationEntry[];
  title: string;
  onNavigate?: () => void;
  className?: string;
};

export function SidebarNavigationPane({
  entries,
  title,
  onNavigate,
  className,
}: SidebarNavigationPaneProps) {
  const activeEntryId = entries.find((entry) => entry.isActive && entry.children.length > 0)?.id;
  const [openEntryId, setOpenEntryId] = React.useState<string | undefined>(activeEntryId);

  React.useEffect(() => {
    setOpenEntryId(activeEntryId);
  }, [activeEntryId]);

  return (
    <nav aria-label={title} className={cn('min-w-0', className)}>
      <p className="px-3 pt-3 pb-2 text-xs font-medium tracking-wide text-[var(--dashboard-navigation-section-label-foreground)] uppercase">
        {title}
      </p>
      <ul className="flex min-w-0 flex-col gap-1">
        {entries.map((entry) => (
          <li key={entry.id} className="min-w-0">
            {entry.children.length > 0 ? (
              <Collapsible
                open={openEntryId === entry.id}
                onOpenChange={(open) => setOpenEntryId(open ? entry.id : undefined)}
                className="group/entry"
              >
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      'dashboard-navigation-item flex h-auto min-h-10 w-full min-w-0 items-start gap-2 rounded-lg px-3 py-2 text-left text-sm text-[var(--dashboard-navigation-item-foreground)] outline-hidden hover:text-sidebar-accent-foreground',
                      entry.isActive &&
                        'dashboard-navigation-item--active text-sidebar-accent-foreground'
                    )}
                  >
                    {entry.icon ? <entry.icon className="mt-0.5 size-4 shrink-0" /> : null}
                    <span className="min-w-0 flex-1 whitespace-normal leading-4">
                      {entry.title}
                    </span>
                    <ChevronRight className="dashboard-navigation-disclosure-icon mt-0.5 size-4 shrink-0 transition-transform group-data-[state=open]/entry:rotate-90" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="sidebar-nav-collapsible-content">
                  <ul className="mt-1 ml-2.5 flex min-w-0 flex-col gap-1 border-l border-[var(--dashboard-navigation-subtree-border)] py-0.5 pl-1">
                    {entry.children.map((child) => (
                      <li key={child.id} className="min-w-0">
                        <SidebarNavigationLink entry={child} onNavigate={onNavigate} />
                      </li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <SidebarNavigationLink entry={entry} onNavigate={onNavigate} root />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

type SidebarNavigationLinkProps = {
  entry: ResolvedSidebarNavigationEntry;
  onNavigate?: () => void;
  root?: boolean;
};

function SidebarNavigationLink({ entry, onNavigate, root = false }: SidebarNavigationLinkProps) {
  const Icon = entry.icon;

  return (
    <Link
      href={entry.href}
      onClick={onNavigate}
      className={cn(
        'dashboard-navigation-item flex h-auto min-h-9 min-w-0 items-start gap-2 rounded-lg px-3 py-2 text-sm text-[var(--dashboard-navigation-item-muted-foreground)] outline-hidden hover:text-sidebar-accent-foreground',
        root && 'min-h-10 px-3 text-[var(--dashboard-navigation-item-foreground)]',
        entry.isActive && 'dashboard-navigation-item--active text-sidebar-accent-foreground'
      )}
    >
      {Icon ? <Icon className="mt-0.5 size-4 shrink-0" /> : null}
      <span className="min-w-0 whitespace-normal leading-4">{entry.title}</span>
    </Link>
  );
}
