'use client';

import { format, isValid, parse } from 'date-fns';
import { CalendarDays, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface TableFilterDateInputProps {
  value: string | null;
  onValueChange: (value: string | null) => void;
  disabled?: boolean;
  clearable?: boolean;
  placeholder?: string;
  openCalendarLabel: string;
  clearLabel: string;
  invalidDateMessage?: string;
  calendarLocale?: ComponentProps<typeof Calendar>['locale'];
  className?: string;
}

function toDate(isoDate: string | null) {
  if (!isoDate) return null;
  const parsed = parse(isoDate, 'yyyy-MM-dd', new Date());
  return isValid(parsed) && format(parsed, 'yyyy-MM-dd') === isoDate ? parsed : null;
}

function toIsoDate(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

function toLocalizedDate(isoDate: string | null) {
  const date = toDate(isoDate);
  return date ? format(date, 'dd/MM/yyyy') : '';
}

function maskDateInput(input: string) {
  if (input.includes('/')) {
    const [rawDay = '', rawMonth = '', rawYear = ''] = input.split('/');
    const day = rawDay.replace(/\D/g, '').slice(0, 2);
    const month = rawMonth.replace(/\D/g, '').slice(0, 2);
    const year = rawYear.replace(/\D/g, '').slice(0, 4);
    const hasMonthSegment = input.split('/').length > 1;
    const hasYearSegment = input.split('/').length > 2;

    let masked = day;
    if (hasMonthSegment || day.length === 2) masked += '/';
    if (hasMonthSegment) masked += month;
    if (hasYearSegment || month.length === 2) masked += '/';
    if (hasYearSegment) masked += year;
    return masked;
  }

  const digits = input.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits.length === 2 ? `${digits}/` : digits;
  if (digits.length <= 4)
    return `${digits.slice(0, 2)}/${digits.slice(2)}${digits.length === 4 ? '/' : ''}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function parseLocalizedDate(input: string) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(input)) return null;
  const parsed = parse(input, 'dd/MM/yyyy', new Date());
  return isValid(parsed) && format(parsed, 'dd/MM/yyyy') === input ? parsed : null;
}

export function TableFilterDateInput({
  value,
  onValueChange,
  disabled = false,
  clearable = false,
  placeholder = 'dd/mm/aaaa',
  openCalendarLabel,
  clearLabel,
  invalidDateMessage = 'Fecha inválida.',
  calendarLocale,
  className,
}: TableFilterDateInputProps) {
  const [open, setOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState(() => toLocalizedDate(value));
  const [invalid, setInvalid] = useState(false);
  const selectedDate = useMemo(() => toDate(value), [value]);

  useEffect(() => {
    setDisplayValue(toLocalizedDate(value));
    setInvalid(false);
  }, [value]);

  const handleManualChange = (nextValue: string) => {
    const maskedValue = maskDateInput(nextValue);
    setDisplayValue(maskedValue);
    setInvalid(false);

    if (!maskedValue) {
      onValueChange(null);
      return;
    }

    const parsed = parseLocalizedDate(maskedValue);
    if (parsed) onValueChange(toIsoDate(parsed));
  };

  const handleBlur = () => {
    if (!displayValue) return;

    const parsed = parseLocalizedDate(displayValue);
    if (parsed) {
      onValueChange(toIsoDate(parsed));
      return;
    }

    setInvalid(true);
  };

  return (
    <div className={cn('grid gap-1.5', className)}>
      <div className="relative">
        <Input
          value={displayValue}
          inputMode="numeric"
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={invalid || undefined}
          onChange={(event) => handleManualChange(event.target.value)}
          onBlur={handleBlur}
          className={cn('h-10 pr-10', clearable && value && 'pr-[4.5rem]')}
        />
        {clearable && value ? (
          <button
            type="button"
            disabled={disabled}
            aria-label={clearLabel}
            className="absolute right-9 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            onClick={() => onValueChange(null)}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : null}
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
          <PopoverContent align="end" side="top" className="w-auto p-0">
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
