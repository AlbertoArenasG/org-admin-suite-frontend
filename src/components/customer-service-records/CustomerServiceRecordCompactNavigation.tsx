'use client';

import { AttachFileIcon, ClipboardCheckIcon, FlaskIcon, UsersIcon } from 'lucide-animated';
import type { ReactNode, RefObject } from 'react';

import type { ResourceFormNavigationItem } from '@/components/resource-form';
import { useResourceFormNavigation } from '@/components/resource-form/useResourceFormNavigation';
import { MonitorCogIcon } from '@/components/ui/monitor-cog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type CustomerServiceRecordCompactNavigationProps = {
  ariaLabel: string;
  items: readonly ResourceFormNavigationItem[];
  scrollContainerRef: RefObject<HTMLElement | null>;
};

const itemIcons: Record<string, ReactNode> = {
  'customer-delivery': <UsersIcon animateOnHover size={19} />,
  documents: <AttachFileIcon animateOnHover size={19} />,
  equipment: <MonitorCogIcon size={19} />,
  'general-details': <ClipboardCheckIcon animateOnHover size={19} />,
  'provider-follow-up': <FlaskIcon animateOnHover size={19} />,
};

function CustomerServiceRecordCompactNavigation({
  ariaLabel,
  items,
  scrollContainerRef,
}: CustomerServiceRecordCompactNavigationProps) {
  const { activeId, navigate } = useResourceFormNavigation({ items, scrollContainerRef });

  return (
    <nav
      aria-label={ariaLabel}
      className="hidden flex-col items-center gap-2 md:flex lg:hidden"
      data-slot="customer-service-record-compact-navigation"
    >
      {items.map((item) => {
        const isActive = item.id === activeId;

        return (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <button
                aria-current={isActive ? 'location' : undefined}
                className={cn(
                  'flex size-10 items-center justify-center rounded-full border bg-background shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
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

export { CustomerServiceRecordCompactNavigation };
