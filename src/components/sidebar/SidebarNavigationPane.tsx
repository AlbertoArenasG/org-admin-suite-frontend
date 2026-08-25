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
      <p className="px-3 pb-2 text-xs font-medium tracking-wide text-sidebar-foreground/60 uppercase">
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
                      'flex h-auto min-h-10 w-full min-w-0 items-start gap-2 rounded-lg px-3 py-2 text-left text-sm text-sidebar-foreground/85 outline-hidden transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                      entry.isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
                    )}
                  >
                    {entry.icon ? <entry.icon className="mt-0.5 size-4 shrink-0" /> : null}
                    <span className="min-w-0 flex-1 whitespace-normal leading-4">
                      {entry.title}
                    </span>
                    <ChevronRight className="mt-0.5 size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/entry:rotate-90" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="sidebar-nav-collapsible-content">
                  <ul className="border-sidebar-border/80 mt-1 ml-3 flex min-w-0 flex-col gap-1 border-l py-0.5 pl-1">
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
        'flex h-auto min-h-9 min-w-0 items-start gap-2 rounded-lg px-1 py-2 text-sm text-sidebar-foreground/75 outline-hidden transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring',
        root && 'min-h-10 px-3 text-sidebar-foreground/85',
        entry.isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
      )}
    >
      {Icon ? <Icon className="mt-0.5 size-4 shrink-0" /> : null}
      <span className="min-w-0 whitespace-normal leading-4">{entry.title}</span>
    </Link>
  );
}
