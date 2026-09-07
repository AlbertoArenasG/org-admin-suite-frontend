import { Check } from 'lucide-react';

import type { DashboardFilterOption } from '@/components/filters/filter-menu.types';
import { cn } from '@/lib/utils';

interface FilterOptionListProps {
  emptyMessage: string;
  onValueChange: (value: string) => void;
  options: readonly DashboardFilterOption[];
  value?: string;
}

export function FilterOptionList({
  emptyMessage,
  onValueChange,
  options,
  value,
}: FilterOptionListProps) {
  if (!options.length) {
    return <p className="px-4 py-8 text-center text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="py-2">
      {options.map((option) => {
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            disabled={option.disabled}
            aria-pressed={isSelected}
            onClick={() => onValueChange(option.value)}
            className={cn(
              'flex min-h-11 w-full items-center gap-3 px-4 py-2 text-left text-sm text-foreground transition-[color,background-color] duration-[var(--control-transition-duration)] ease-[var(--control-transition-easing)] hover:bg-[var(--control-hover-surface)] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--control-focus-ring)]',
              isSelected && 'bg-[var(--control-selection-surface)]'
            )}
          >
            <span className="min-w-0 flex-1 truncate">{option.label}</span>
            {isSelected ? (
              <>
                <Check
                  className="size-4 shrink-0 text-[var(--control-selection-indicator)]"
                  aria-hidden="true"
                />
                <span className="sr-only">Seleccionado</span>
              </>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
