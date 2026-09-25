'use client';

import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Command } from 'cmdk';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type FormSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SharedProps = {
  id?: string;
  ariaLabel?: string;
  options: readonly FormSelectOption[];
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  disabled?: boolean;
  invalid?: boolean;
  renderOption?: (option: FormSelectOption, selected: boolean) => ReactNode;
  renderValue?: (option: FormSelectOption) => ReactNode;
};

type FormComboboxProps = SharedProps & {
  value: string | null;
  onValueChange: (value: string | null) => void;
  allowClear?: boolean;
};

export function FormCombobox({
  allowClear = false,
  ariaLabel,
  disabled,
  emptyMessage,
  id,
  invalid,
  onValueChange,
  options,
  placeholder,
  renderOption,
  renderValue,
  searchPlaceholder,
  value,
}: FormComboboxProps) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-label={ariaLabel}
          aria-expanded={open}
          aria-invalid={invalid || undefined}
          className="h-9 w-full justify-between font-normal"
          disabled={disabled}
          id={id}
          role="combobox"
          type="button"
          variant="outline"
        >
          <span className="min-w-0 truncate text-left">
            {selectedOption ? (renderValue?.(selectedOption) ?? selectedOption.label) : placeholder}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex max-h-[var(--radix-popover-content-available-height)] w-[var(--radix-popover-trigger-width)] min-w-64 flex-col overflow-hidden p-0"
      >
        <Command className="flex min-h-0 w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground">
          <div className="flex items-center gap-2 border-b px-3">
            <Search aria-hidden className="size-4 shrink-0 text-muted-foreground" />
            <Command.Input
              className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder={searchPlaceholder}
            />
          </div>
          <Command.List
            className="min-h-0 max-h-64 flex-1 overflow-y-auto overscroll-contain p-1"
            onWheelCapture={(event) => event.stopPropagation()}
          >
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </Command.Empty>
            <Command.Group>
              {options.map((option) => {
                const selected = option.value === value;

                return (
                  <Command.Item
                    className="flex cursor-default items-center gap-2 rounded-md px-2 py-2 text-sm outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                    disabled={option.disabled}
                    key={option.value}
                    onSelect={() => {
                      onValueChange(selected && allowClear ? null : option.value);
                      setOpen(false);
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

export type { FormComboboxProps };
