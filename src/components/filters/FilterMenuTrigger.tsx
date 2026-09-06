import { ChevronDown, SlidersHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import { DashboardButton } from '@/components/ui/dashboard-button';

interface FilterMenuTriggerProps {
  activeCount: number;
  className?: string;
  label: string;
}

export function FilterMenuTrigger({ activeCount, className, label }: FilterMenuTriggerProps) {
  return (
    <DashboardButton
      type="button"
      variant="outline"
      size="sm"
      aria-label={activeCount ? `${label}: ${activeCount} activos` : label}
      className={cn(
        '!border-[var(--filter-menu-trigger-border)] !bg-[var(--filter-menu-trigger-surface)] !text-[var(--filter-menu-trigger-foreground)] !shadow-[var(--filter-menu-trigger-shadow)] hover:!border-[var(--filter-menu-trigger-hover-border)] hover:!bg-[var(--filter-menu-trigger-hover-surface)]',
        className
      )}
    >
      <SlidersHorizontal className="size-4" aria-hidden="true" />
      {label}
      {activeCount ? (
        <span className="inline-flex size-4 items-center justify-center rounded-full bg-[var(--filter-menu-count-surface)] text-[0.625rem] font-semibold text-[var(--filter-menu-count-foreground)]">
          {activeCount}
        </span>
      ) : null}
      <ChevronDown className="size-3.5" aria-hidden="true" />
    </DashboardButton>
  );
}
