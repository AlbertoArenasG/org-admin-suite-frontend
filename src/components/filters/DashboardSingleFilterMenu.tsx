'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

import { FilterMenuTrigger } from '@/components/filters/FilterMenuTrigger';
import { FilterOptionList } from '@/components/filters/FilterOptionList';
import type { DashboardFilterCategory } from '@/components/filters/filter-menu.types';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DashboardSingleFilterMenuProps {
  category: DashboardFilterCategory;
  className?: string;
  label?: string;
  onReset: () => void;
  onSearchChange?: (query: string) => void;
  onValueChange: (value: string) => void;
  value?: string;
}

/** A compact filter picker for one independent selection category. */
export function DashboardSingleFilterMenu({
  category,
  className,
  label = category.label,
  onReset,
  onSearchChange,
  onValueChange,
  value,
}: DashboardSingleFilterMenuProps) {
  const activeCount = value ? 1 : 0;
  const [searchQuery, setSearchQuery] = useState('');
  const visibleOptions = category.searchable
    ? category.options.filter((option) =>
        option.label.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
      )
    : category.options;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FilterMenuTrigger activeCount={activeCount} className={className} label={label} />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className={cn(
          'w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-[var(--radius-card)] border-[var(--control-border)] bg-popover p-0 text-popover-foreground shadow-[var(--control-shadow)] [backdrop-filter:var(--control-popover-backdrop)]'
        )}
      >
        {category.searchable ? (
          <label className="relative block border-b border-[var(--control-border)] p-2">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={searchQuery}
              onChange={(event) => {
                const query = event.target.value;
                setSearchQuery(query);
                onSearchChange?.(query);
              }}
              placeholder={category.searchPlaceholder ?? `Buscar ${category.label.toLowerCase()}`}
              aria-label={`Buscar opciones de ${category.label}`}
              className="h-[var(--control-height-compact)] w-full rounded-[var(--control-radius)] border border-[var(--control-border)] bg-[var(--control-surface)] py-0 pr-3 pl-8 text-sm text-[var(--control-foreground)] outline-none placeholder:text-muted-foreground focus-visible:border-[var(--control-focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--control-focus-ring)] focus-visible:ring-offset-2"
            />
          </label>
        ) : null}
        <FilterOptionList
          emptyMessage={
            category.searchable ? 'No hay opciones que coincidan.' : 'No hay opciones disponibles.'
          }
          options={visibleOptions}
          value={value}
          onValueChange={onValueChange}
        />
        {activeCount ? (
          <div className="mt-1.5 border-t border-[var(--control-border)] pt-1.5">
            <button
              type="button"
              onClick={onReset}
              className="flex h-8 w-full items-center rounded-[var(--control-radius)] px-2.5 text-sm font-medium text-foreground transition-[color,background-color] duration-[var(--control-transition-duration)] ease-[var(--control-transition-easing)] hover:bg-[var(--control-hover-surface)] focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--control-focus-ring)]"
            >
              Restablecer filtro
            </button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
