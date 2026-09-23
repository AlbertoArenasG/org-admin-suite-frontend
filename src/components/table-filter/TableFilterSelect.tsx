'use client';

import { Check, ChevronDown, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import type { TableFilterOption, TableFilterSelection } from './types';

interface TableFilterSelectProps {
  label: string;
  options: TableFilterOption[];
  selectedValues: string[];
  onSelectedValuesChange: (values: string[]) => void;
  selection?: TableFilterSelection;
  placeholder: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  loadingMessage?: string;
  disabled?: boolean;
  clearable?: boolean;
  ariaLabel?: string;
  className?: string;
}

export function TableFilterSelect({
  label,
  options,
  selectedValues,
  onSelectedValuesChange,
  selection = 'single',
  placeholder,
  searchable = false,
  searchPlaceholder,
  emptyMessage = 'No hay opciones disponibles.',
  loading = false,
  loadingMessage = 'Cargando opciones...',
  disabled = false,
  clearable = true,
  ariaLabel,
  className,
}: TableFilterSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selectedOptions = options.filter((option) => selectedValues.includes(option.value));
  const hasSelection = selectedOptions.length > 0;
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return options;

    return options.filter((option) =>
      [option.label, option.description]
        .filter(Boolean)
        .some((value) => value?.toLocaleLowerCase().includes(normalizedQuery))
    );
  }, [options, query]);

  const displayValue =
    selection === 'single'
      ? (selectedOptions[0]?.label ?? placeholder)
      : selectedOptions.length === 1
        ? selectedOptions[0].label
        : selectedOptions.length > 1
          ? `${selectedOptions
              .slice(0, 2)
              .map((option) => option.label)
              .join(', ')}${selectedOptions.length > 2 ? ` +${selectedOptions.length - 2}` : ''}`
          : placeholder;

  const updateOpen = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) setQuery('');
  };

  const toggleOption = (option: TableFilterOption) => {
    const selected = selectedValues.includes(option.value);

    if (selection === 'single') {
      onSelectedValuesChange(selected ? [] : [option.value]);
      updateOpen(false);
      return;
    }

    onSelectedValuesChange(
      selected
        ? selectedValues.filter((value) => value !== option.value)
        : [...selectedValues, option.value]
    );
  };

  return (
    <div className={cn('grid gap-1.5', className)}>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <Popover open={open} onOpenChange={updateOpen}>
        <div className="relative">
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              aria-label={ariaLabel ?? label}
              className={cn(
                'flex h-10 w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-left text-sm shadow-xs transition-colors outline-none hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                hasSelection && 'border-primary/60 bg-primary/5 text-foreground',
                !hasSelection && 'text-muted-foreground',
                hasSelection && clearable && 'pr-10'
              )}
            >
              <span className="min-w-0 flex-1 truncate">{displayValue}</span>
              {!hasSelection ? (
                <ChevronDown className="size-4 shrink-0" aria-hidden="true" />
              ) : null}
            </button>
          </PopoverTrigger>
          {hasSelection && clearable ? (
            <button
              type="button"
              disabled={disabled}
              aria-label={`Limpiar ${label}`}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
              onClick={() => onSelectedValuesChange([])}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>
        <PopoverContent
          align="start"
          className="flex max-h-[var(--radix-popover-content-available-height)] w-[var(--radix-popover-trigger-width)] flex-col overflow-hidden p-2"
        >
          {searchable ? (
            <div className="relative mb-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder ?? placeholder}
                autoFocus
                className="pl-9"
              />
            </div>
          ) : null}
          <div
            className="min-h-0 max-h-64 overflow-y-auto overscroll-contain"
            role="listbox"
            aria-label={label}
            aria-multiselectable={selection === 'multiple' || undefined}
            onWheelCapture={(event) => event.stopPropagation()}
          >
            {loading ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">{loadingMessage}</p>
            ) : filteredOptions.length === 0 ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">{emptyMessage}</p>
            ) : (
              filteredOptions.map((option) => {
                const selected = selectedValues.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground',
                      selected && 'bg-primary/5'
                    )}
                    onClick={() => toggleOption(option)}
                  >
                    {selection === 'multiple' ? (
                      <span
                        className={cn(
                          'flex size-4 shrink-0 items-center justify-center rounded-sm border border-input',
                          selected && 'border-primary bg-primary text-primary-foreground'
                        )}
                        aria-hidden="true"
                      >
                        {selected ? <Check className="size-3" /> : null}
                      </span>
                    ) : (
                      <span
                        className={cn(
                          'flex size-4 shrink-0 items-center justify-center rounded-full border border-muted-foreground/60',
                          selected && 'border-primary'
                        )}
                        aria-hidden="true"
                      >
                        {selected ? <span className="size-2 rounded-full bg-primary" /> : null}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{option.label}</span>
                      {option.description ? (
                        <span className="block truncate text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      ) : null}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
