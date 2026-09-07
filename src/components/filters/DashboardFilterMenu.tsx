'use client';

import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id ?? '');
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  const [hasTabOverflow, setHasTabOverflow] = useState(false);
  const [canScrollTabsBackward, setCanScrollTabsBackward] = useState(false);
  const [canScrollTabsForward, setCanScrollTabsForward] = useState(false);
  const [tabListElement, setTabListElement] = useState<HTMLDivElement | null>(null);
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

  useEffect(() => {
    const tabList = tabListElement;

    if (!tabList) {
      return;
    }

    const scrollableTabList: HTMLDivElement = tabList;

    function updateTabScrollState() {
      const maximumScrollLeft = scrollableTabList.scrollWidth - scrollableTabList.clientWidth;

      setHasTabOverflow(maximumScrollLeft > 1);
      setCanScrollTabsBackward(scrollableTabList.scrollLeft > 1);
      setCanScrollTabsForward(scrollableTabList.scrollLeft < maximumScrollLeft - 1);
    }

    const animationFrame = window.requestAnimationFrame(updateTabScrollState);
    scrollableTabList.addEventListener('scroll', updateTabScrollState, { passive: true });
    const observer = new ResizeObserver(updateTabScrollState);
    observer.observe(scrollableTabList);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      scrollableTabList.removeEventListener('scroll', updateTabScrollState);
      observer.disconnect();
    };
  }, [categories, tabListElement]);

  useEffect(() => {
    const activeTab =
      tabRefs.current[categories.findIndex((category) => category.id === activeCategoryId)];

    activeTab?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }, [activeCategoryId, categories, isOpen]);

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

  function scrollTabs(direction: 1 | -1) {
    const tabList = tabListElement;

    if (!tabList) {
      return;
    }

    tabList.scrollBy({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      left: direction * Math.round(tabList.clientWidth * 0.7),
    });
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <FilterMenuTrigger activeCount={activeCount} className={className} label={label} />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className={cn(
          'w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-[var(--radius-card)] border-[var(--control-border)] bg-popover p-0 text-popover-foreground shadow-[var(--control-shadow)] [backdrop-filter:var(--control-popover-backdrop)]'
        )}
      >
        <div className="flex items-center gap-1 border-b border-[var(--control-border)] bg-muted p-1">
          <div
            ref={setTabListElement}
            role="tablist"
            aria-label="Categorías de filtros"
            className="flex min-w-0 flex-1 gap-1 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                    'flex h-8 shrink-0 items-center justify-center rounded-[var(--control-radius)] px-3 text-xs font-medium whitespace-nowrap text-muted-foreground transition-[color,background-color,box-shadow] duration-[var(--control-transition-duration)] ease-[var(--control-transition-easing)] focus-visible:z-10 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--control-focus-ring)]',
                    isActive &&
                      'bg-[var(--control-surface)] text-[var(--control-foreground)] shadow-[var(--control-shadow)]'
                  )}
                >
                  <span className="truncate">{category.label}</span>
                </button>
              );
            })}
          </div>

          {hasTabOverflow ? (
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                aria-label="Ver categorías de filtros anteriores"
                disabled={!canScrollTabsBackward}
                onClick={() => scrollTabs(-1)}
                className="inline-flex size-8 items-center justify-center rounded-[var(--control-radius)] border border-[var(--control-border)] bg-[var(--control-surface)] text-[var(--control-foreground)] shadow-[var(--control-shadow)] transition-[color,background-color,opacity] duration-[var(--control-transition-duration)] ease-[var(--control-transition-easing)] hover:bg-[var(--control-hover-surface)] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--control-focus-ring)]"
              >
                <ChevronLeft className="size-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Ver más categorías de filtros"
                disabled={!canScrollTabsForward}
                onClick={() => scrollTabs(1)}
                className="inline-flex size-8 items-center justify-center rounded-[var(--control-radius)] border border-[var(--control-border)] bg-[var(--control-surface)] text-[var(--control-foreground)] shadow-[var(--control-shadow)] transition-[color,background-color,opacity] duration-[var(--control-transition-duration)] ease-[var(--control-transition-easing)] hover:bg-[var(--control-hover-surface)] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--control-focus-ring)]"
              >
                <ChevronRight className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>

        <div
          id={`${tabIds}-${activeCategory.id}-panel`}
          role="tabpanel"
          aria-labelledby={`${tabIds}-${activeCategory.id}-tab`}
          className="p-0"
        >
          {activeCategory.searchable ? (
            <label className="relative block border-b border-[var(--control-border)] p-2">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
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
                className="h-[var(--control-height-compact)] w-full rounded-[var(--control-radius)] border border-[var(--control-border)] bg-[var(--control-surface)] py-0 pr-3 pl-8 text-sm text-[var(--control-foreground)] outline-none placeholder:text-muted-foreground focus-visible:border-[var(--control-focus-ring)] focus-visible:ring-2 focus-visible:ring-[var(--control-focus-ring)] focus-visible:ring-offset-2"
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
          <div className="border-t border-[var(--control-border)] p-1.5">
            <button
              type="button"
              onClick={onReset}
              className="flex h-8 w-full items-center rounded-[var(--control-radius)] px-2.5 text-sm font-medium text-foreground transition-[color,background-color] duration-[var(--control-transition-duration)] ease-[var(--control-transition-easing)] hover:bg-[var(--control-hover-surface)] focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--control-focus-ring)]"
            >
              Restablecer filtros
            </button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
