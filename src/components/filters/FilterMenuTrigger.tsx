import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface FilterMenuTriggerProps extends React.ComponentPropsWithoutRef<'button'> {
  activeCount: number;
  className?: string;
  label: string;
}

export const FilterMenuTrigger = React.forwardRef<HTMLButtonElement, FilterMenuTriggerProps>(
  function FilterMenuTrigger({ activeCount, className, label, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        {...props}
        aria-label={activeCount ? `${label}: ${activeCount} activos` : label}
        className={cn(
          'inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md border border-[var(--filter-menu-trigger-border)] bg-[var(--filter-menu-trigger-surface)] px-3 text-sm font-medium text-[var(--filter-menu-trigger-foreground)] shadow-[var(--filter-menu-trigger-shadow)] outline-none transition-[color,background-color,border-color,box-shadow] duration-[var(--filter-menu-transition-duration)] ease-[var(--filter-menu-transition-easing)] hover:border-[var(--filter-menu-trigger-hover-border)] hover:bg-[var(--filter-menu-trigger-hover-surface)] focus-visible:[box-shadow:0_0_0_var(--filter-menu-focus-outline-width)_var(--filter-menu-focus-outline-color)] disabled:pointer-events-none disabled:opacity-[var(--button-disabled-opacity)]',
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
      </button>
    );
  }
);
