'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

import { FilterMenuTrigger } from '@/components/filters/FilterMenuTrigger';
import { FilterOptionList } from '@/components/filters/FilterOptionList';
import type { DashboardFilterCategory } from '@/components/filters/filter-menu.types';
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
        className="w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-[var(--filter-menu-radius)] border-[var(--filter-menu-border)] bg-[var(--filter-menu-surface)] p-1.5 text-[var(--filter-menu-foreground)] shadow-[var(--filter-menu-shadow)] [backdrop-filter:var(--filter-menu-backdrop)]"
      >
        {category.searchable ? (
          <label className="relative mb-1.5 block border-b border-[var(--filter-menu-divider)] p-2">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[var(--filter-menu-search-icon)]"
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
              className="h-9 w-full rounded-[var(--filter-menu-search-radius)] border border-[var(--filter-menu-search-border)] bg-[var(--filter-menu-search-surface)] py-1 pr-3 pl-8 text-sm text-[var(--filter-menu-search-foreground)] outline-none placeholder:text-[var(--filter-menu-search-placeholder)] focus-visible:border-[var(--filter-menu-search-focus-border)] focus-visible:[box-shadow:0_0_0_var(--filter-menu-focus-outline-width)_var(--filter-menu-focus-outline-color)]"
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
          <div className="mt-1.5 border-t border-[var(--filter-menu-divider)] pt-1.5">
            <button
              type="button"
              onClick={onReset}
              className="flex h-8 w-full items-center rounded-[var(--filter-menu-option-radius)] px-2.5 text-sm font-medium text-[var(--filter-menu-reset-foreground)] transition-[color,background-color] duration-[var(--filter-menu-transition-duration)] ease-[var(--filter-menu-transition-easing)] hover:bg-[var(--filter-menu-reset-hover-surface)] focus-visible:outline-none focus-visible:[box-shadow:0_0_0_var(--filter-menu-focus-outline-width)_var(--filter-menu-focus-outline-color)]"
            >
              Restablecer filtro
            </button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
