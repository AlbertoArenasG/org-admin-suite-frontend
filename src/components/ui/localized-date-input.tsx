'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { clsx } from 'clsx';

interface LocalizedDateInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  locale?: string;
  placeholder?: string;
  allowClear?: boolean;
  animateToken?: number;
  triggerClassName?: string;
}

function parseDateValue(value: string) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) {
    return null;
  }

  const parsed = new Date(year, month - 1, day, 12, 0, 0);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0);
}

function buildWeekdayLabels(locale: string) {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const reference = new Date(2026, 7, 2, 12, 0, 0);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(reference);
    date.setDate(reference.getDate() + index);
    return formatter.format(date);
  });
}

function buildCalendarDays(month: Date) {
  const firstDay = getMonthStart(month);
  const firstWeekday = firstDay.getDay();
  const firstVisibleDay = new Date(firstDay);
  firstVisibleDay.setDate(firstDay.getDate() - firstWeekday);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstVisibleDay);
    date.setDate(firstVisibleDay.getDate() + index);
    return date;
  });
}

export function LocalizedDateInput({
  id,
  value,
  onChange,
  disabled = false,
  locale = 'es-MX',
  placeholder,
  allowClear = true,
  animateToken = 0,
  triggerClassName,
}: LocalizedDateInputProps) {
  const [open, setOpen] = useState(false);
  const [animatedDisplayValue, setAnimatedDisplayValue] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const selectedDate = useMemo(() => parseDateValue(value), [value]);
  const [visibleMonth, setVisibleMonth] = useState(() =>
    selectedDate ? getMonthStart(selectedDate) : getMonthStart(new Date())
  );

  const normalizedLocale = locale.startsWith('es') ? 'es-MX' : 'en-US';
  const monthFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(normalizedLocale, {
        month: 'long',
        year: 'numeric',
      }),
    [normalizedLocale]
  );
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(normalizedLocale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    [normalizedLocale]
  );
  const weekdayLabels = useMemo(() => buildWeekdayLabels(normalizedLocale), [normalizedLocale]);
  const calendarDays = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth]);

  useEffect(() => {
    if (!selectedDate) {
      return;
    }

    setVisibleMonth(getMonthStart(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const today = new Date();
  const todayValue = toDateValue(today);
  const displayValue = selectedDate ? dateFormatter.format(selectedDate) : '';
  const resolvedDisplayValue = animatedDisplayValue ?? displayValue;
  const resolvedPlaceholder =
    placeholder ?? (normalizedLocale.startsWith('es') ? 'dd/mm/aaaa' : 'mm/dd/yyyy');

  useEffect(() => {
    if (!animateToken || !displayValue) {
      setAnimatedDisplayValue(null);
      setIsAnimating(false);
      return;
    }

    setAnimatedDisplayValue('');
    setIsAnimating(true);

    let currentIndex = 0;
    const typingInterval = window.setInterval(() => {
      currentIndex += 1;
      setAnimatedDisplayValue(displayValue.slice(0, currentIndex));

      if (currentIndex >= displayValue.length) {
        window.clearInterval(typingInterval);
        window.setTimeout(() => {
          setAnimatedDisplayValue(null);
          setIsAnimating(false);
        }, 450);
      }
    }, 40);

    return () => {
      window.clearInterval(typingInterval);
    };
  }, [animateToken, displayValue]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={clsx(
          'flex h-10 w-full items-center justify-between rounded-lg border border-border/60 bg-background px-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/40',
          disabled
            ? 'cursor-not-allowed opacity-60'
            : 'hover:border-primary/50 focus:border-primary',
          !resolvedDisplayValue && 'text-muted-foreground',
          isAnimating &&
            'border-primary ring-2 ring-primary/20 shadow-[0_0_0_1px_rgba(13,148,136,0.22)]',
          triggerClassName
        )}
      >
        <span>{resolvedDisplayValue || resolvedPlaceholder}</span>
        <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[18rem] rounded-2xl border border-border/70 bg-card p-4 shadow-xl">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 rounded-full"
                onClick={() =>
                  setVisibleMonth(
                    new Date(visibleMonth.getFullYear() - 1, visibleMonth.getMonth(), 1, 12, 0, 0)
                  )
                }
              >
                <ChevronsLeft className="size-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 rounded-full"
                onClick={() =>
                  setVisibleMonth(
                    new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1, 12, 0, 0)
                  )
                }
              >
                <ChevronLeft className="size-4" />
              </Button>
            </div>

            <p className="text-sm font-semibold capitalize text-foreground">
              {monthFormatter.format(visibleMonth)}
            </p>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 rounded-full"
                onClick={() =>
                  setVisibleMonth(
                    new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1, 12, 0, 0)
                  )
                }
              >
                <ChevronRight className="size-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 rounded-full"
                onClick={() =>
                  setVisibleMonth(
                    new Date(visibleMonth.getFullYear() + 1, visibleMonth.getMonth(), 1, 12, 0, 0)
                  )
                }
              >
                <ChevronsRight className="size-4" />
              </Button>
            </div>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1">
            {weekdayLabels.map((label) => (
              <span
                key={label}
                className="flex h-8 items-center justify-center text-xs font-medium uppercase text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const dayValue = toDateValue(day);
              const isSelected = dayValue === value;
              const isToday = dayValue === todayValue;
              const isCurrentMonth = day.getMonth() === visibleMonth.getMonth();

              return (
                <button
                  key={dayValue}
                  type="button"
                  onClick={() => {
                    onChange(dayValue);
                    setOpen(false);
                  }}
                  className={clsx(
                    'flex h-9 items-center justify-center rounded-lg text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/40',
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-foreground',
                    !isCurrentMonth && 'text-muted-foreground/50',
                    isToday && !isSelected && 'border border-primary/40'
                  )}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onChange(todayValue);
                setVisibleMonth(getMonthStart(today));
              }}
            >
              {normalizedLocale.startsWith('es') ? 'Hoy' : 'Today'}
            </Button>

            <div className="flex items-center gap-2">
              {allowClear ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onChange('');
                    setOpen(false);
                  }}
                >
                  {normalizedLocale.startsWith('es') ? 'Limpiar' : 'Clear'}
                </Button>
              ) : null}

              <Button type="button" size="sm" onClick={() => setOpen(false)}>
                {normalizedLocale.startsWith('es') ? 'Aceptar' : 'Done'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
