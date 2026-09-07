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
          'inline-flex h-[var(--control-height-compact)] shrink-0 items-center justify-center gap-1.5 rounded-[var(--control-radius)] border border-[var(--control-border)] bg-[var(--control-surface)] px-[var(--control-padding-inline)] text-sm font-medium text-[var(--control-foreground)] shadow-[var(--control-shadow)] outline-none transition-[color,background-color,border-color,box-shadow] duration-[var(--control-transition-duration)] ease-[var(--control-transition-easing)] hover:bg-[var(--control-hover-surface)] focus-visible:[box-shadow:0_0_0_2px_var(--control-focus-ring)] disabled:pointer-events-none disabled:opacity-50',
          className
        )}
      >
        <SlidersHorizontal className="size-4" aria-hidden="true" />
        {label}
        {activeCount ? (
          <span className="inline-flex size-4 items-center justify-center rounded-full bg-[var(--secondary-50)] text-[0.625rem] font-semibold text-[var(--secondary-700)]">
            {activeCount}
          </span>
        ) : null}
        <ChevronDown className="size-3.5" aria-hidden="true" />
      </button>
    );
  }
);
