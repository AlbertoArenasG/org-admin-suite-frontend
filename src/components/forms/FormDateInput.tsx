'use client';

import { format, isValid, parse } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type FormDateInputProps = {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  placeholder?: string;
  openCalendarLabel: string;
  invalidDateMessage: string;
  calendarLocale?: ComponentProps<typeof Calendar>['locale'];
  className?: string;
};

function toDate(isoDate: string) {
  if (!isoDate) return null;

  const parsed = parse(isoDate, 'yyyy-MM-dd', new Date());
  return isValid(parsed) && format(parsed, 'yyyy-MM-dd') === isoDate ? parsed : null;
}

function toIsoDate(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

function toLocalizedDate(isoDate: string) {
  const date = toDate(isoDate);
  return date ? format(date, 'dd/MM/yyyy') : '';
}

function maskDateInput(input: string) {
  const digits = input.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits.length === 2 ? `${digits}/` : digits;
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}${digits.length === 4 ? '/' : ''}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function parseLocalizedDate(input: string) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(input)) return null;

  const parsed = parse(input, 'dd/MM/yyyy', new Date());
  return isValid(parsed) && format(parsed, 'dd/MM/yyyy') === input ? parsed : null;
}

export function FormDateInput({
  calendarLocale,
  className,
  disabled = false,
  id,
  invalid: externalInvalid = false,
  invalidDateMessage,
  onValueChange,
  openCalendarLabel,
  placeholder = 'dd/mm/aaaa',
  value,
}: FormDateInputProps) {
  const [open, setOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState(() => toLocalizedDate(value));
  const [invalid, setInvalid] = useState(false);
  const selectedDate = useMemo(() => toDate(value), [value]);

  useEffect(() => {
    setDisplayValue(toLocalizedDate(value));
    setInvalid(false);
  }, [value]);

  const handleChange = (nextValue: string) => {
    const maskedValue = maskDateInput(nextValue);
    setDisplayValue(maskedValue);
    setInvalid(false);

    const parsed = parseLocalizedDate(maskedValue);
    if (parsed) onValueChange(toIsoDate(parsed));
  };

  const handleBlur = () => {
    if (!displayValue) {
      setInvalid(true);
      return;
    }

    const parsed = parseLocalizedDate(displayValue);
    if (!parsed) {
      setInvalid(true);
      onValueChange('');
      return;
    }

    onValueChange(toIsoDate(parsed));
  };

  return (
    <div className={cn('grid gap-1.5', className)}>
      <div className="relative">
        <Input
          id={id}
          value={displayValue}
          inputMode="numeric"
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={externalInvalid || invalid || undefined}
          onChange={(event) => handleChange(event.target.value)}
          onBlur={handleBlur}
          className="pr-10"
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={disabled}
              aria-label={openCalendarLabel}
              className="absolute right-1 top-1/2 size-8 -translate-y-1/2"
            >
              <CalendarDays className="size-4" aria-hidden="true" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate ?? undefined}
              defaultMonth={selectedDate ?? new Date()}
              captionLayout="dropdown"
              locale={calendarLocale}
              onSelect={(date) => {
                if (!date) return;
                onValueChange(toIsoDate(date));
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      {invalid ? <p className="text-xs text-destructive">{invalidDateMessage}</p> : null}
    </div>
  );
}

export type { FormDateInputProps };
