'use client';

import { Check, ChevronDown, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string | null;
  onValueChange: (value: string | null) => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  loading?: boolean;
  loadingMessage?: string;
  disabled?: boolean;
  clearable?: boolean;
  portalled?: boolean;
  className?: string;
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  loading = false,
  loadingMessage,
  disabled = false,
  clearable = false,
  portalled = true,
  className,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selectedOption = options.find((option) => option.value === value) ?? null;
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return options;

    return options.filter((option) =>
      [option.label, option.description]
        .filter(Boolean)
        .some((field) => field?.toLocaleLowerCase().includes(normalizedQuery))
    );
  }, [options, query]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) setQuery('');
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <div className="relative">
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              'flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 text-left text-sm shadow-xs transition-colors hover:bg-muted/40 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
              clearable && selectedOption && 'pr-14',
              !selectedOption && 'text-muted-foreground',
              className
            )}
          >
            <span className="min-w-0 flex-1 truncate">{selectedOption?.label ?? placeholder}</span>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        {clearable && selectedOption ? (
          <button
            type="button"
            aria-label="Limpiar selección"
            className="absolute right-8 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            onClick={() => onValueChange(null)}
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-2"
        onOpenAutoFocus={(event) => event.preventDefault()}
        portalled={portalled}
      >
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder}
          autoFocus
          className="mb-2"
        />
        <div className="max-h-64 overflow-y-auto" role="listbox">
          {loading ? (
            <p className="px-2 py-3 text-sm text-muted-foreground">
              {loadingMessage ?? emptyMessage}
            </p>
          ) : filteredOptions.length === 0 ? (
            <p className="px-2 py-3 text-sm text-muted-foreground">{emptyMessage}</p>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
                  onClick={() => {
                    onValueChange(option.value);
                    setOpen(false);
                  }}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{option.label}</span>
                    {option.description ? (
                      <span className="block truncate text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    ) : null}
                  </span>
                  {isSelected ? <Check className="size-4 shrink-0 text-primary" /> : null}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface MultiSelectProps {
  options: ComboboxOption[];
  values: string[];
  onValuesChange: (values: string[]) => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  loading?: boolean;
  loadingMessage?: string;
  disabled?: boolean;
  selectedSummary?: string;
  className?: string;
}

export function MultiSelect({
  options,
  values,
  onValuesChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  loading = false,
  loadingMessage,
  disabled = false,
  selectedSummary,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selectedLabels = options
    .filter((option) => values.includes(option.value))
    .map((option) => option.label);
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return options;

    return options.filter((option) =>
      [option.label, option.description]
        .filter(Boolean)
        .some((field) => field?.toLocaleLowerCase().includes(normalizedQuery))
    );
  }, [options, query]);

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setQuery('');
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'flex min-h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-left text-sm shadow-xs transition-colors hover:bg-muted/40 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
            selectedLabels.length === 0 && 'text-muted-foreground',
            className
          )}
        >
          <span className="min-w-0 flex-1 truncate">
            {selectedLabels.length > 0
              ? (selectedSummary ?? selectedLabels.join(', '))
              : placeholder}
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-2"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder}
          autoFocus
          className="mb-2"
        />
        <div className="max-h-64 overflow-y-auto" role="listbox" aria-multiselectable="true">
          {loading ? (
            <p className="px-2 py-3 text-sm text-muted-foreground">
              {loadingMessage ?? emptyMessage}
            </p>
          ) : filteredOptions.length === 0 ? (
            <p className="px-2 py-3 text-sm text-muted-foreground">{emptyMessage}</p>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = values.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
                  onClick={() => {
                    onValuesChange(
                      isSelected
                        ? values.filter((value) => value !== option.value)
                        : [...values, option.value]
                    );
                    setOpen(false);
                  }}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{option.label}</span>
                    {option.description ? (
                      <span className="block truncate text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    ) : null}
                  </span>
                  {isSelected ? <Check className="size-4 shrink-0 text-primary" /> : null}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
