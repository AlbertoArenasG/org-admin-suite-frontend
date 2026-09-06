import { Check } from 'lucide-react';

import type { DashboardFilterOption } from '@/components/filters/filter-menu.types';

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
    return (
      <p className="px-2.5 py-3 text-sm text-[var(--filter-menu-empty-foreground)]">
        {emptyMessage}
      </p>
    );
  }

  return options.map((option) => {
    const isSelected = value === option.value;

    return (
      <button
        key={option.value}
        type="button"
        disabled={option.disabled}
        aria-pressed={isSelected}
        onClick={() => onValueChange(option.value)}
        className="flex min-h-9 w-full items-center gap-3 rounded-[var(--filter-menu-option-radius)] px-2.5 py-2 text-left text-sm text-[var(--filter-menu-option-foreground)] transition-[color,background-color] duration-[var(--filter-menu-transition-duration)] ease-[var(--filter-menu-transition-easing)] hover:bg-[var(--filter-menu-option-hover-surface)] disabled:pointer-events-none disabled:opacity-[var(--filter-menu-disabled-opacity)] focus-visible:outline-none focus-visible:[box-shadow:0_0_0_var(--filter-menu-focus-outline-width)_var(--filter-menu-focus-outline-color)]"
      >
        <span className="min-w-0 flex-1 truncate">{option.label}</span>
        {isSelected ? (
          <>
            <Check
              className="size-4 shrink-0 text-[var(--filter-menu-option-selected-indicator)]"
              aria-hidden="true"
            />
            <span className="sr-only">Seleccionado</span>
          </>
        ) : null}
      </button>
    );
  });
}
