'use client';

import { es } from 'date-fns/locale';
import { Filter, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  TableFilterDateRange,
  TableFilterDialog,
  TableFilterSection,
  TableFilterSelect,
  type TableFilterDateField,
} from '@/components/table-filter';
import type {
  CustomerServiceRecordOption,
  CustomerServiceRecordsListFilters,
} from '@/features/customer-service-records';

import {
  areCustomerServiceRecordsFilterDialogValuesEqual,
  clearCustomerServiceRecordsListFilters,
  cloneCustomerServiceRecordsFilterDialogValue,
  createEmptyCustomerServiceRecordsFilterDialogValue,
  getCustomerServiceRecordsAppliedFilterCount,
  hasCustomerServiceRecordsFilterCriteria,
  toCustomerServiceRecordsFilterDialogValue,
  toCustomerServiceRecordsListFilters,
} from './customerServiceRecordsFilterAdapter';

interface CustomerServiceRecordsFilterDialogProps {
  filters: CustomerServiceRecordsListFilters;
  serviceTypes: CustomerServiceRecordOption[];
  customers: CustomerServiceRecordOption[];
  providers: CustomerServiceRecordOption[];
  loadingOptions: boolean;
  onFiltersChange: (nextFilters: CustomerServiceRecordsListFilters) => void;
}

const dateFields: Array<TableFilterDateField & { translationKey: string }> = [
  { id: 'requestedAt', label: '', translationKey: 'requestedAt' },
  { id: 'receivedAt', label: '', translationKey: 'receivedAt' },
  {
    id: 'estimatedCustomerDeliveryAt',
    label: '',
    translationKey: 'customerDeliveryAt',
  },
  { id: 'providerEstimatedReturnAt', label: '', translationKey: 'providerReturnAt' },
];

const statusLabelKeys = {
  PENDING: 'pending',
  IN_PROGRESS: 'inProgress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export function CustomerServiceRecordsFilterDialog({
  filters,
  serviceTypes,
  customers,
  providers,
  loadingOptions,
  onFiltersChange,
}: CustomerServiceRecordsFilterDialogProps) {
  const { t } = useTranslation('customerServiceRecords');
  const [open, setOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const clearTimerRef = useRef<number | null>(null);
  const appliedValue = toCustomerServiceRecordsFilterDialogValue(filters);
  const appliedFilterCount = getCustomerServiceRecordsAppliedFilterCount(filters);
  const dateFieldOptions = dateFields.map(({ id, translationKey }) => ({
    id,
    label: t(`filters.${translationKey}`),
  }));

  useEffect(() => {
    if (!appliedFilterCount) setIsClearing(false);
  }, [appliedFilterCount]);

  useEffect(
    () => () => {
      if (clearTimerRef.current !== null) window.clearTimeout(clearTimerRef.current);
    },
    []
  );

  const handleClearFilters = () => {
    if (isClearing) return;

    setIsClearing(true);
    clearTimerRef.current = window.setTimeout(() => {
      clearTimerRef.current = null;
      onFiltersChange(clearCustomerServiceRecordsListFilters(filters));
    }, 160);
  };

  return (
    <>
      <div className="inline-flex">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={
            appliedFilterCount
              ? 'rounded-r-none transition-[border-radius,background-color,color,box-shadow] duration-150'
              : undefined
          }
          onClick={() => setOpen(true)}
        >
          <Filter className="size-4" aria-hidden="true" />
          {t('filters.dialog.trigger')}
          {appliedFilterCount ? (
            <>
              <span
                className={`inline-flex size-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground transition-[opacity,transform] duration-150 ${
                  isClearing ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
                }`}
                aria-hidden="true"
              >
                {appliedFilterCount}
              </span>
              <span className="sr-only">
                {t('filters.dialog.appliedCount', { count: appliedFilterCount })}
              </span>
            </>
          ) : null}
        </Button>
        {appliedFilterCount ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isClearing}
                className={`-ml-px rounded-l-none transition-[opacity,transform] duration-150 ${
                  isClearing ? 'translate-x-1 opacity-0' : 'translate-x-0 opacity-100'
                }`}
                aria-label={t('filters.dialog.clear')}
                onClick={handleClearFilters}
              >
                <RotateCcw className="size-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6}>
              {t('filters.dialog.clear')}
            </TooltipContent>
          </Tooltip>
        ) : null}
      </div>

      <TableFilterDialog
        open={open}
        onOpenChange={setOpen}
        value={appliedValue}
        createDraft={cloneCustomerServiceRecordsFilterDialogValue}
        createEmptyValue={createEmptyCustomerServiceRecordsFilterDialogValue}
        isEqual={areCustomerServiceRecordsFilterDialogValuesEqual}
        hasActiveCriteria={hasCustomerServiceRecordsFilterCriteria}
        onApply={(value) => onFiltersChange(toCustomerServiceRecordsListFilters(value, filters))}
        labels={{
          title: t('filters.dialog.title'),
          clear: t('filters.dialog.clear'),
          cancel: t('filters.dialog.cancel'),
          apply: t('filters.dialog.apply'),
          showAll: t('filters.dialog.showAll'),
        }}
      >
        {({ draft, setDraft }) => (
          <>
            <TableFilterSection
              title={t('filters.dialog.classification.title')}
              description={t('filters.dialog.classification.description')}
            >
              <TableFilterSelect
                label={t('filters.dialog.serviceType')}
                options={serviceTypes}
                selectedValues={draft.serviceTypeCode ? [draft.serviceTypeCode] : []}
                onSelectedValuesChange={(values) =>
                  setDraft((current) => ({ ...current, serviceTypeCode: values[0] ?? null }))
                }
                placeholder={t('filters.serviceTypePlaceholder')}
                orientation="responsive"
                searchable
                searchPlaceholder={t('filters.dialog.searchOptions')}
                loading={loadingOptions}
              />
              <TableFilterSelect
                label={t('filters.dialog.customer')}
                options={customers}
                selectedValues={draft.customerId ? [draft.customerId] : []}
                onSelectedValuesChange={(values) =>
                  setDraft((current) => ({ ...current, customerId: values[0] ?? null }))
                }
                placeholder={t('filters.customerPlaceholder')}
                orientation="responsive"
                searchable
                searchPlaceholder={t('filters.dialog.searchOptions')}
                loading={loadingOptions}
              />
              <TableFilterSelect
                label={t('filters.dialog.operationalStatus')}
                options={Object.entries(statusLabelKeys).map(([value, labelKey]) => ({
                  value,
                  label: t(`statuses.${labelKey}`),
                }))}
                selectedValues={draft.operationalStatus ? [draft.operationalStatus] : []}
                onSelectedValuesChange={(values) =>
                  setDraft((current) => ({
                    ...current,
                    operationalStatus: (values[0] as typeof current.operationalStatus) ?? null,
                  }))
                }
                placeholder={t('filters.statusPlaceholder')}
                orientation="responsive"
              />
              <TableFilterSelect
                label={t('filters.dialog.provider')}
                options={providers}
                selectedValues={draft.providerId ? [draft.providerId] : []}
                onSelectedValuesChange={(values) =>
                  setDraft((current) => ({ ...current, providerId: values[0] ?? null }))
                }
                placeholder={t('filters.providerPlaceholder')}
                orientation="responsive"
                searchable
                searchPlaceholder={t('filters.dialog.searchOptions')}
                loading={loadingOptions}
              />
              <TableFilterSelect
                label={t('filters.dialog.hasProvider')}
                options={[
                  { value: 'true', label: t('filters.providerStateYes') },
                  { value: 'false', label: t('filters.providerStateNo') },
                ]}
                selectedValues={draft.hasProvider === null ? [] : [String(draft.hasProvider)]}
                onSelectedValuesChange={(values) =>
                  setDraft((current) => ({
                    ...current,
                    hasProvider: values[0] === 'true' ? true : values[0] === 'false' ? false : null,
                  }))
                }
                placeholder={t('filters.providerStatePlaceholder')}
                orientation="responsive"
              />
            </TableFilterSection>

            <TableFilterSection
              title={t('filters.dialog.period.title')}
              description={t('filters.dialog.period.description')}
            >
              <TableFilterDateRange
                fields={dateFieldOptions}
                value={draft.dateRange}
                onValueChange={(dateRange) =>
                  setDraft((current) => ({
                    ...current,
                    dateRange,
                  }))
                }
                presets={[
                  { id: 'previous-week', label: t('filters.dialog.period.previousWeek') },
                  { id: 'current-week', label: t('filters.dialog.period.currentWeek') },
                  { id: 'next-week', label: t('filters.dialog.period.nextWeek') },
                  { id: 'previous-month', label: t('filters.dialog.period.previousMonth') },
                  { id: 'current-month', label: t('filters.dialog.period.currentMonth') },
                  { id: 'next-month', label: t('filters.dialog.period.nextMonth') },
                ]}
                labels={{
                  fieldLabel: t('filters.dialog.period.field'),
                  fieldPlaceholder: t('filters.dialog.period.fieldPlaceholder'),
                  from: t('filters.from'),
                  to: t('filters.to'),
                  clearPeriod: t('filters.dialog.period.clear'),
                  clearDate: t('filters.dialog.period.clearDate'),
                  openCalendar: t('filters.dialog.period.openCalendar'),
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
