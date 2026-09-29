'use client';

import { ClipboardList, FolderOpen, Wrench } from 'lucide-react';
import type { ReactNode, RefObject } from 'react';

import type { ResourceFormNavigationItem } from '@/components/resource-form';
import { useResourceFormNavigation } from '@/components/resource-form/useResourceFormNavigation';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type ServicePackageRecordCompactNavigationProps = {
  ariaLabel: string;
  items: readonly ResourceFormNavigationItem[];
  scrollContainerRef: RefObject<HTMLElement | null>;
};

const itemIcons: Record<string, ReactNode> = {
  documents: <FolderOpen className="size-5" />,
  equipment: <Wrench className="size-5" />,
  'general-details': <ClipboardList className="size-5" />,
};

export function ServicePackageRecordCompactNavigation({
  ariaLabel,
  items,
  scrollContainerRef,
}: ServicePackageRecordCompactNavigationProps) {
  const { activeId, navigate } = useResourceFormNavigation({ items, scrollContainerRef });

  return (
    <nav
      aria-label={ariaLabel}
      className="hidden flex-col items-center gap-2 md:flex lg:hidden"
      data-slot="service-package-record-compact-navigation"
    >
      {items.map((item) => {
        const isActive = item.id === activeId;

        return (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <button
                aria-current={isActive ? 'location' : undefined}
                className={cn(
                  'flex size-10 cursor-pointer items-center justify-center rounded-full border bg-background shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                onClick={() => navigate(item.id)}
                type="button"
              >
                {itemIcons[item.id]}
                <span className="sr-only">{item.label}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              {item.label}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </nav>
  );
}
