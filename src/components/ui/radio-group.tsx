'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface RadioGroupOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  value: string | null;
  onValueChange: (value: string) => void;
  options: RadioGroupOption[];
  disabled?: boolean;
  className?: string;
  'aria-label': string;
}

export function RadioGroup({
  name,
  value,
  onValueChange,
  options,
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn('grid gap-2 sm:grid-cols-2', className)}
    >
      {options.map((option) => {
        const checked = option.value === value;
        const optionDisabled = disabled || option.disabled;

        return (
          <label
            key={option.value}
            className={cn(
              'flex cursor-pointer items-start gap-3 rounded-lg border border-input bg-background px-3 py-2.5 text-sm shadow-xs transition-colors hover:bg-muted/50',
              checked && 'border-primary bg-primary/5',
              optionDisabled && 'cursor-not-allowed opacity-60'
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              disabled={optionDisabled}
              onChange={() => onValueChange(option.value)}
              className="mt-0.5 size-4 accent-primary"
            />
            <span className="min-w-0">
              <span className="block font-medium text-foreground">{option.label}</span>
              {option.description ? (
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {option.description}
                </span>
              ) : null}
            </span>
          </label>
        );
      })}
    </div>
  );
}
