'use client';

import { faker } from '@faker-js/faker';
import { format } from 'date-fns';
import { CalendarIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { Button } from './button';
import { Calendar } from './calendar';
import styles from './ShadcnDatePickerWithRange.module.css';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from 'cn';

const now = new Date();
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

const from = faker.date.between({
  from: startOfMonth,
  to: new Date(now.getFullYear(), now.getMonth(), 15),
});
const to = faker.date.between({
  from: new Date(now.getFullYear(), now.getMonth(), 16),
  to: endOfMonth,
});

export interface ShadcnDatePickerWithRangeProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (value: DateRange | undefined) => void;
  placeholder?: string;
  clearLabel?: string;
}

export function ShadcnDatePickerWithRange({
  value,
  defaultValue = { from, to },
  onValueChange,
  placeholder = 'Pick a date range',
  clearLabel = 'Clear selected date range',
}: ShadcnDatePickerWithRangeProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState<DateRange | undefined>(defaultValue);
  const date = value ?? uncontrolledValue;

  const handleValueChange = (nextValue: DateRange | undefined) => {
    if (value === undefined) {
      setUncontrolledValue(nextValue);
    }

    onValueChange?.(nextValue);
  };

  return (
    <div className={styles.scope}>
      <div className={cn(styles.control, date?.from && styles.hasValue)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className={cn(
                'w-[280px] justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
              variant="outline"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
                )
              ) : (
                <span>{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className={cn('w-auto p-0', styles.popover)}>
            <Calendar
              mode="range"
              numberOfMonths={2}
              captionLayout="label"
              onSelect={handleValueChange}
              selected={date}
            />
          </PopoverContent>
        </Popover>
        {date?.from ? (
          <Button
            className={styles.clearButton}
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => handleValueChange(undefined)}
          >
            <XIcon aria-hidden="true" />
            <span className="sr-only">{clearLabel}</span>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
