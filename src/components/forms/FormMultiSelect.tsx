'use client';

import { Check, ChevronsUpDown, Search, X } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';
import { Command } from 'cmdk';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { FormSelectOption } from '@/components/forms/FormCombobox';
import { cn } from '@/lib/utils';

type FormMultiSelectProps = {
  value: readonly string[];
  onValueChange: (value: string[]) => void;
  options: readonly FormSelectOption[];
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  disabled?: boolean;
  invalid?: boolean;
  maxVisibleSelections?: number;
  removeItemLabel?: (option: FormSelectOption) => string;
  renderOption?: (option: FormSelectOption, selected: boolean) => ReactNode;
};

export function FormMultiSelect({
  disabled,
  emptyMessage,
  invalid,
  maxVisibleSelections = 2,
  onValueChange,
  options,
  placeholder,
  removeItemLabel,
  renderOption,
  searchPlaceholder,
  value,
}: FormMultiSelectProps) {
  const contentId = useId();
  const [open, setOpen] = useState(false);
  const selectedOptions = options.filter((option) => value.includes(option.value));
  const visibleSelections = selectedOptions.slice(0, maxVisibleSelections);
  const hiddenSelections = selectedOptions.length - visibleSelections.length;

  const removeSelection = (option: FormSelectOption) => {
    onValueChange(value.filter((selectedValue) => selectedValue !== option.value));
  };

  const trigger = (
    <div
      aria-disabled={disabled || undefined}
      aria-controls={contentId}
      aria-expanded={open}
      aria-invalid={invalid || undefined}
      aria-label={
        selectedOptions.length
          ? selectedOptions.map((option) => option.label).join(', ')
          : placeholder
      }
      className={cn(
        'flex h-10 w-full min-w-0 items-center gap-2 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        invalid ? 'border-destructive' : null
      )}
      onKeyDown={(event) => {
        if (disabled) return;

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setOpen((current) => !current);
        }

        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setOpen(true);
        }
      }}
      role="combobox"
      tabIndex={disabled ? -1 : 0}
    >
      <span className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
        {selectedOptions.length ? (
          <>
            {visibleSelections.map((option) => (
              <span
                className="inline-flex min-w-0 max-w-24 shrink items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium sm:max-w-40"
                key={option.value}
              >
                <span className="truncate">{option.label}</span>
                <button
                  aria-label={removeItemLabel?.(option) ?? option.label}
                  className="-mr-1 inline-flex size-4 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  disabled={disabled}
                  onClick={(event) => {
                    event.stopPropagation();
                    removeSelection(option);
                  }}
                  type="button"
                >
                  <X aria-hidden="true" className="size-3" />
                </button>
              </span>
            ))}
            {hiddenSelections > 0 ? (
              <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs font-medium">
                +{hiddenSelections}
              </span>
            ) : null}
          </>
        ) : (
          <span className="truncate text-muted-foreground">{placeholder}</span>
        )}
      </span>
      <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
    </div>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {disabled ? trigger : <PopoverTrigger asChild>{trigger}</PopoverTrigger>}
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] min-w-64 p-0"
        id={contentId}
      >
        <Command className="flex w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground">
          <div className="flex items-center gap-2 border-b px-3">
            <Search aria-hidden className="size-4 shrink-0 text-muted-foreground" />
            <Command.Input
              className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder={searchPlaceholder}
            />
          </div>
          <Command.List className="max-h-64 overflow-y-auto p-1">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </Command.Empty>
            <Command.Group>
              {options.map((option) => {
                const selected = value.includes(option.value);

                return (
                  <Command.Item
                    className="flex cursor-default items-center gap-2 rounded-md px-2 py-2 text-sm outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                    disabled={option.disabled}
                    key={option.value}
                    onSelect={() => {
                      onValueChange(
                        selected
                          ? value.filter((selectedValue) => selectedValue !== option.value)
                          : [...value, option.value]
                      );
                    }}
                    value={`${option.label} ${option.value}`}
                  >
                    {renderOption?.(option, selected) ?? (
                      <span className="min-w-0 flex-1 truncate">{option.label}</span>
                    )}
                    <Check
                      className={cn(
                        'ml-auto size-4 shrink-0',
                        selected ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </Command.Item>
                );
              })}
            </Command.Group>
          </Command.List>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export type { FormMultiSelectProps };
