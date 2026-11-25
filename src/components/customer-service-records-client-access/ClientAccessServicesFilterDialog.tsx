'use client';

import { useState } from 'react';
import { es } from 'date-fns/locale';
import { Filter, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  TableFilterDateRange,
  TableFilterDialog,
  TableFilterSection,
  TableFilterSelect,
} from '@/components/table-filter';
import type {
  ClientAccessFilterOption,
  ClientAccessListFilters,
} from '@/features/customer-service-records-client-access';
import { EMPTY_CLIENT_ACCESS_FILTERS } from '@/utils/customerServiceRecordsClientAccessQuery';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

type Props = {
  filters: ClientAccessListFilters;
  customers: ClientAccessFilterOption[];
  serviceTypes: ClientAccessFilterOption[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onChange: (filters: ClientAccessListFilters) => void;
};

export function ClientAccessServicesFilterDialog({
  filters,
  customers,
  serviceTypes,
  loading,
  error,
  onRetry,
  onChange,
}: Props) {
  const { t } = useTranslationHydrated('clientAccessServices');
  const [open, setOpen] = useState(false);
  const count =
    Number(Boolean(filters.customerId)) +
    Number(Boolean(filters.serviceTypeCode)) +
    Number(Boolean(filters.dateRange.fieldId && (filters.dateRange.from || filters.dateRange.to)));
  const empty = () => ({
    ...EMPTY_CLIENT_ACCESS_FILTERS,
    dateRange: { ...EMPTY_CLIENT_ACCESS_FILTERS.dateRange },
  });
  const equal = (a: ClientAccessListFilters, b: ClientAccessListFilters) =>
    JSON.stringify(a) === JSON.stringify(b);
  return (
    <>
      <div className="inline-flex">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={count ? 'rounded-r-none' : undefined}
          onClick={() => setOpen(true)}
        >
          <Filter aria-hidden="true" className="size-4" />
          {t('filters.trigger')}
          {count > 0 && (
            <span
              className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground"
              aria-label={t('filters.count', { count })}
            >
              {count}
            </span>
          )}
        </Button>
        {count > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="-ml-px rounded-l-none"
                aria-label={t('filters.clear')}
                onClick={() => onChange(empty())}
              >
                <RotateCcw className="size-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{t('filters.clear')}</TooltipContent>
          </Tooltip>
        )}
      </div>
      <TableFilterDialog
        open={open}
        onOpenChange={setOpen}
        value={filters}
        createDraft={(value) => ({ ...value, dateRange: { ...value.dateRange } })}
        createEmptyValue={empty}
        isEqual={equal}
        hasActiveCriteria={(value) =>
          Boolean(
            value.customerId ||
              value.serviceTypeCode ||
              (value.dateRange.fieldId && (value.dateRange.from || value.dateRange.to))
          )
        }
        onApply={onChange}
        labels={{
          title: t('filters.title'),
          clear: t('filters.clear'),
          cancel: t('filters.cancel'),
          apply: t('filters.apply'),
          showAll: t('filters.showAll'),
        }}
      >
        {({ draft, setDraft }) => (
          <>
            <TableFilterSection title={t('filters.classification')}>
              <TableFilterSelect
                label={t('filters.customer')}
                options={customers}
                selectedValues={draft.customerId ? [draft.customerId] : []}
                onSelectedValuesChange={(values) =>
                  setDraft((current) => ({ ...current, customerId: values[0] ?? null }))
                }
                placeholder={t('filters.anyCustomer')}
                orientation="responsive"
                searchable
                searchPlaceholder={t('filters.searchOptions')}
                loading={loading}
              />
              <TableFilterSelect
                label={t('filters.serviceType')}
                options={serviceTypes}
                selectedValues={draft.serviceTypeCode ? [draft.serviceTypeCode] : []}
                onSelectedValuesChange={(values) =>
                  setDraft((current) => ({ ...current, serviceTypeCode: values[0] ?? null }))
                }
                placeholder={t('filters.anyServiceType')}
                orientation="responsive"
                searchable
                searchPlaceholder={t('filters.searchOptions')}
                loading={loading}
              />
              {error && (
                <div role="alert" className="space-y-2 text-sm">
                  <p>{error}</p>
                  <Button type="button" size="sm" variant="outline" onClick={onRetry}>
                    {t('actions.retry')}
                  </Button>
                </div>
              )}
            </TableFilterSection>
            <TableFilterSection title={t('filters.period')}>
              <TableFilterDateRange
                fields={[
                  { id: 'receivedAt', label: t('filters.receivedAt') },
                  { id: 'estimatedDeliveryAt', label: t('filters.estimatedDeliveryAt') },
                ]}
                value={draft.dateRange}
                onValueChange={(dateRange) =>
                  setDraft((current) => ({
                    ...current,
                    dateRange: {
                      fieldId: dateRange.fieldId as ClientAccessListFilters['dateRange']['fieldId'],
                      from: dateRange.from,
                      to: dateRange.to,
                    },
                  }))
                }
                presets={[
                  { id: 'previous-week', label: t('filters.previousWeek') },
                  { id: 'current-week', label: t('filters.currentWeek') },
                  { id: 'next-week', label: t('filters.nextWeek') },
                  { id: 'previous-month', label: t('filters.previousMonth') },
                  { id: 'current-month', label: t('filters.currentMonth') },
                  { id: 'next-month', label: t('filters.nextMonth') },
                ]}
                labels={{
                  fieldLabel: t('filters.dateField'),
                  fieldPlaceholder: t('filters.selectDateField'),
                  from: t('filters.from'),
                  to: t('filters.to'),
                  clearPeriod: t('filters.clearPeriod'),
                  clearDate: t('filters.clearDate'),
                  openCalendar: t('filters.openCalendar'),
                }}
                calendarLocale={es}
                orientation="responsive"
              />
            </TableFilterSection>
          </>
        )}
      </TableFilterDialog>
    </>
  );
}
