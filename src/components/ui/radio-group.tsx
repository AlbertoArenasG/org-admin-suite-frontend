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
  variant?: 'card' | 'bare';
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
  'aria-label': string;
}

export function RadioGroup({
  name,
  value,
  onValueChange,
  options,
  variant = 'card',
  readOnly = false,
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: RadioGroupProps) {
  return (
    <div
      role={readOnly ? 'group' : 'radiogroup'}
      aria-label={ariaLabel}
      className={cn(
        variant === 'card' ? 'grid gap-2 sm:grid-cols-2' : 'flex flex-wrap gap-x-4 gap-y-2',
        className
      )}
    >
      {options.map((option) => {
        const checked = option.value === value;
        const optionDisabled = disabled || option.disabled;
        const OptionContainer = readOnly ? 'div' : 'label';

        return (
          <OptionContainer
            key={option.value}
            className={cn(
              variant === 'card'
                ? 'flex items-start gap-3 rounded-lg border border-input bg-background px-3 py-2.5 text-sm shadow-xs transition-colors'
                : 'flex items-center gap-2 text-sm',
              !readOnly && 'cursor-pointer',
              !readOnly && variant === 'card' && 'hover:bg-muted/50',
              variant === 'card' && checked && 'border-primary bg-primary/5',
              optionDisabled && 'cursor-not-allowed opacity-60'
            )}
          >
            {readOnly ? (
              <span
                aria-hidden="true"
                className={cn(
                  'flex size-4 shrink-0 items-center justify-center rounded-full border border-muted-foreground/60',
                  variant === 'card' && 'mt-0.5',
                  checked && 'border-primary'
                )}
              >
                {checked ? <span className="size-2 rounded-full bg-primary" /> : null}
              </span>
            ) : (
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                disabled={optionDisabled}
                onChange={() => onValueChange(option.value)}
                className={cn('size-4 accent-primary', variant === 'card' && 'mt-0.5')}
              />
            )}
            <span className={cn('min-w-0', variant === 'bare' && 'text-foreground')}>
              <span className={cn('block text-foreground', variant === 'card' && 'font-medium')}>
                {option.label}
              </span>
              {readOnly ? (
                <span className="sr-only">{checked ? 'seleccionado' : 'no seleccionado'}</span>
              ) : null}
              {option.description ? (
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {option.description}
                </span>
              ) : null}
            </span>
          </OptionContainer>
        );
      })}
    </div>
  );
}
