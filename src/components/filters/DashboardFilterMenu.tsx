'use client';

import { Search } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import { FilterMenuTrigger } from '@/components/filters/FilterMenuTrigger';
import { FilterOptionList } from '@/components/filters/FilterOptionList';
import type { DashboardFilterCategory } from '@/components/filters/filter-menu.types';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export type {
  DashboardFilterCategory,
  DashboardFilterOption,
} from '@/components/filters/filter-menu.types';

interface DashboardFilterMenuProps {
  categories: readonly DashboardFilterCategory[];
  values: Readonly<Record<string, string | undefined>>;
  onValueChange: (categoryId: string, value: string) => void;
  onReset: () => void;
  onSearchChange?: (categoryId: string, query: string) => void;
  className?: string;
  label?: string;
}

/**
 * One compact entry point for independent, single-select list filters.
 * The parent owns fetching, query synchronization and filter state.
 */
export function DashboardFilterMenu({
  categories,
  values,
  onValueChange,
  onReset,
  onSearchChange,
  className,
  label = 'Filtros',
}: DashboardFilterMenuProps) {
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id ?? '');
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  const tabIds = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeCategory =
    categories.find((category) => category.id === activeCategoryId) ?? categories[0];
  const activeCount = categories.filter((category) => Boolean(values[category.id])).length;
  const activeSearchQuery = activeCategory ? (searchQueries[activeCategory.id] ?? '') : '';
  const visibleOptions = activeCategory?.searchable
    ? activeCategory.options.filter((option) =>
        option.label.toLocaleLowerCase().includes(activeSearchQuery.toLocaleLowerCase())
      )
    : (activeCategory?.options ?? []);

  useEffect(() => {
    if (activeCategory) {
      setActiveCategoryId((current) =>
        categories.some((category) => category.id === current) ? current : activeCategory.id
      );
    }
  }, [activeCategory, categories]);

  if (!activeCategory) {
    return null;
  }

  function focusRelativeTab(direction: 1 | -1) {
    const currentIndex = categories.findIndex((category) => category.id === activeCategory.id);
    const nextIndex = (currentIndex + direction + categories.length) % categories.length;
    const nextCategory = categories[nextIndex];

    setActiveCategoryId(nextCategory.id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FilterMenuTrigger activeCount={activeCount} className={className} label={label} />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-[var(--filter-menu-radius)] border-[var(--filter-menu-border)] bg-[var(--filter-menu-surface)] p-0 text-[var(--filter-menu-foreground)] shadow-[var(--filter-menu-shadow)] [backdrop-filter:var(--filter-menu-backdrop)]"
      >
        <div
          role="tablist"
          aria-label="Categorías de filtros"
          className="grid grid-flow-col auto-cols-fr gap-1 border-b border-[var(--filter-menu-divider)] bg-[var(--filter-menu-tabs-surface)] p-1"
        >
          {categories.map((category, index) => {
            const isActive = category.id === activeCategory.id;

            return (
              <button
                key={category.id}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                id={`${tabIds}-${category.id}-tab`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`${tabIds}-${category.id}-panel`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveCategoryId(category.id)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    focusRelativeTab(1);
                  }

                  if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    focusRelativeTab(-1);
                  }
                }}
                className={cn(
                  'flex h-8 min-w-0 items-center justify-center rounded-[var(--filter-menu-tab-radius)] px-2 text-xs font-medium text-[var(--filter-menu-tab-foreground)] transition-[color,background-color,box-shadow] duration-[var(--filter-menu-transition-duration)] ease-[var(--filter-menu-transition-easing)] focus-visible:z-10 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_var(--filter-menu-focus-outline-width)_var(--filter-menu-focus-outline-color)]',
                  isActive &&
                    'bg-[var(--filter-menu-tab-active-surface)] text-[var(--filter-menu-tab-active-foreground)] shadow-[var(--filter-menu-tab-active-shadow)]'
                )}
              >
                <span className="truncate">{category.label}</span>
              </button>
            );
          })}
        </div>

        <div
          id={`${tabIds}-${activeCategory.id}-panel`}
          role="tabpanel"
          aria-labelledby={`${tabIds}-${activeCategory.id}-tab`}
          className="p-1.5"
        >
          {activeCategory.searchable ? (
            <label className="relative block border-b border-[var(--filter-menu-divider)] p-2">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[var(--filter-menu-search-icon)]"
              />
              <input
                value={activeSearchQuery}
                onChange={(event) => {
                  const query = event.target.value;
                  setSearchQueries((current) => ({ ...current, [activeCategory.id]: query }));
                  onSearchChange?.(activeCategory.id, query);
                }}
                placeholder={
                  activeCategory.searchPlaceholder ?? `Buscar ${activeCategory.label.toLowerCase()}`
                }
                aria-label={`Buscar opciones de ${activeCategory.label}`}
                className="h-9 w-full rounded-[var(--filter-menu-search-radius)] border border-[var(--filter-menu-search-border)] bg-[var(--filter-menu-search-surface)] py-1 pr-3 pl-8 text-sm text-[var(--filter-menu-search-foreground)] outline-none placeholder:text-[var(--filter-menu-search-placeholder)] focus-visible:border-[var(--filter-menu-search-focus-border)] focus-visible:[box-shadow:0_0_0_var(--filter-menu-focus-outline-width)_var(--filter-menu-focus-outline-color)]"
              />
            </label>
          ) : null}
          <FilterOptionList
            emptyMessage="No hay opciones que coincidan."
            options={visibleOptions}
            value={values[activeCategory.id]}
            onValueChange={(value) => onValueChange(activeCategory.id, value)}
          />
        </div>

        {activeCount ? (
          <div className="border-t border-[var(--filter-menu-divider)] p-1.5">
            <button
              type="button"
              onClick={onReset}
              className="flex h-8 w-full items-center rounded-[var(--filter-menu-option-radius)] px-2.5 text-sm font-medium text-[var(--filter-menu-reset-foreground)] transition-[color,background-color] duration-[var(--filter-menu-transition-duration)] ease-[var(--filter-menu-transition-easing)] hover:bg-[var(--filter-menu-reset-hover-surface)] focus-visible:outline-none focus-visible:[box-shadow:0_0_0_var(--filter-menu-focus-outline-width)_var(--filter-menu-focus-outline-color)]"
            >
              Restablecer filtros
            </button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
