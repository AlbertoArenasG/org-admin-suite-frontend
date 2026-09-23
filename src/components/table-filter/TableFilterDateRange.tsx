'use client';

import {
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from 'date-fns';
import { Check } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

import { TableFilterDateInput } from './TableFilterDateInput';
import { TableFilterSelect } from './TableFilterSelect';
import type {
  TableFilterDateField,
  TableFilterDatePreset,
  TableFilterDatePresetId,
  TableFilterDateRangeValue,
} from './types';

interface TableFilterDateRangeLabels {
  fieldLabel: string;
  fieldPlaceholder: string;
  from: string;
  to: string;
  clearPeriod: string;
  openCalendar: string;
  clearDate: string;
  legacyNotice?: ReactNode;
}

interface TableFilterDateRangeProps {
  fields: TableFilterDateField[];
  value: TableFilterDateRangeValue;
  onValueChange: (value: TableFilterDateRangeValue) => void;
  presets: TableFilterDatePreset[];
  labels: TableFilterDateRangeLabels;
  calendarLocale?: ComponentProps<typeof Calendar>['locale'];
  disabled?: boolean;
}

export function getTableFilterDatePresetRange(
  presetId: TableFilterDatePresetId,
  referenceDate = new Date()
) {
  const weekOptions = { weekStartsOn: 1 as const };

  switch (presetId) {
    case 'previous-week': {
      const previousWeek = subWeeks(referenceDate, 1);
      return {
        from: format(startOfWeek(previousWeek, weekOptions), 'yyyy-MM-dd'),
        to: format(endOfWeek(previousWeek, weekOptions), 'yyyy-MM-dd'),
      };
    }
    case 'current-week':
      return {
        from: format(startOfWeek(referenceDate, weekOptions), 'yyyy-MM-dd'),
        to: format(endOfWeek(referenceDate, weekOptions), 'yyyy-MM-dd'),
      };
    case 'next-week': {
      const nextWeek = addWeeks(referenceDate, 1);
      return {
        from: format(startOfWeek(nextWeek, weekOptions), 'yyyy-MM-dd'),
        to: format(endOfWeek(nextWeek, weekOptions), 'yyyy-MM-dd'),
      };
    }
    case 'previous-month': {
      const previousMonth = subMonths(referenceDate, 1);
      return {
        from: format(startOfMonth(previousMonth), 'yyyy-MM-dd'),
        to: format(endOfMonth(previousMonth), 'yyyy-MM-dd'),
      };
    }
    case 'current-month':
      return {
        from: format(startOfMonth(referenceDate), 'yyyy-MM-dd'),
        to: format(endOfMonth(referenceDate), 'yyyy-MM-dd'),
      };
    case 'next-month': {
      const nextMonth = addMonths(referenceDate, 1);
      return {
        from: format(startOfMonth(nextMonth), 'yyyy-MM-dd'),
        to: format(endOfMonth(nextMonth), 'yyyy-MM-dd'),
      };
    }
  }
}

export function TableFilterDateRange({
  fields,
  value,
  onValueChange,
  presets,
  labels,
  calendarLocale,
  disabled = false,
}: TableFilterDateRangeProps) {
  const hasMultipleFields = fields.length > 1;
  const selectedFieldId = value.fieldId ?? (fields.length === 1 ? fields[0].id : null);
  const rangeEnabled = Boolean(selectedFieldId) && !disabled;
  const hasPeriod = Boolean(value.fieldId || value.from || value.to);

  const clearPeriod = () => onValueChange({ fieldId: null, from: null, to: null });

  return (
    <div className="grid gap-3">
      {labels.legacyNotice ? (
        <p className="rounded-md border border-border/70 bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          {labels.legacyNotice}
        </p>
      ) : null}

      {hasMultipleFields ? (
        <TableFilterSelect
          label={labels.fieldLabel}
          options={fields.map((field) => ({ value: field.id, label: field.label }))}
          selectedValues={selectedFieldId ? [selectedFieldId] : []}
          onSelectedValuesChange={(values) =>
            onValueChange({ fieldId: values[0] ?? null, from: null, to: null })
          }
          placeholder={labels.fieldPlaceholder}
          disabled={disabled}
          clearable
        />
      ) : null}

      {hasPeriod ? (
        <div className="flex justify-end">
          <Button type="button" variant="ghost" size="sm" disabled={disabled} onClick={clearPeriod}>
            {labels.clearPeriod}
          </Button>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => {
          const range = getTableFilterDatePresetRange(preset.id);
          const active = value.from === range.from && value.to === range.to;
          return (
            <Button
              key={preset.id}
              type="button"
              variant="outline"
              size="sm"
              disabled={!rangeEnabled}
              className={cn(
                active && 'border-primary/50 bg-primary/10 text-primary hover:bg-primary/15'
              )}
              onClick={() => onValueChange({ fieldId: selectedFieldId, ...range })}
            >
              {active ? <Check className="size-4" aria-hidden="true" /> : null}
              {preset.label}
            </Button>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium text-foreground">
          {labels.from}
          <TableFilterDateInput
            value={value.from}
            onValueChange={(from) => onValueChange({ ...value, fieldId: selectedFieldId, from })}
            disabled={!rangeEnabled}
            openCalendarLabel={`${labels.from}: ${labels.openCalendar}`}
            clearLabel={`${labels.from}: ${labels.clearDate}`}
            calendarLocale={calendarLocale}
          />
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-foreground">
          {labels.to}
          <TableFilterDateInput
            value={value.to}
            onValueChange={(to) => onValueChange({ ...value, fieldId: selectedFieldId, to })}
            disabled={!rangeEnabled}
            openCalendarLabel={`${labels.to}: ${labels.openCalendar}`}
            clearLabel={`${labels.to}: ${labels.clearDate}`}
            calendarLocale={calendarLocale}
          />
        </label>
      </div>
    </div>
  );
}
