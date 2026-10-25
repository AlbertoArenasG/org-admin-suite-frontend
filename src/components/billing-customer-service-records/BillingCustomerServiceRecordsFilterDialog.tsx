'use client';

import { Filter, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import {
  TableFilterDialog,
  TableFilterSection,
  TableFilterSelect,
} from '@/components/table-filter';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { BillingCustomerServiceRecordStatus } from '@/features/billing-customer-service-records';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

type FilterValue = { billingStatus: BillingCustomerServiceRecordStatus | null };
type Props = {
  value: BillingCustomerServiceRecordStatus | null;
  options: Array<{ value: string; label: string }>;
  optionsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  optionsError: string | null;
  onRetryOptions: () => void;
  onChange: (value: BillingCustomerServiceRecordStatus | null) => void;
};

export function BillingCustomerServiceRecordsFilterDialog({
  value,
  options,
  optionsStatus,
  optionsError,
  onRetryOptions,
  onChange,
}: Props) {
  const { t } = useTranslationHydrated('billingCustomerServiceRecords');
  const [open, setOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const clearTimerRef = useRef<number | null>(null);
  const appliedFilterCount = value ? 1 : 0;
  const currentValue: FilterValue = { billingStatus: value };

  useEffect(() => {
    if (!appliedFilterCount) setIsClearing(false);
  }, [appliedFilterCount]);
  useEffect(
    () => () => {
      if (clearTimerRef.current !== null) window.clearTimeout(clearTimerRef.current);
    },
    []
  );

  const clearFilters = () => {
    if (isClearing) return;
    setIsClearing(true);
    clearTimerRef.current = window.setTimeout(() => {
      clearTimerRef.current = null;
      onChange(null);
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
          {t('filters.trigger')}
          {appliedFilterCount ? (
            <>
              <span
                className={`inline-flex size-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground transition-[opacity,transform] duration-150 ${isClearing ? 'scale-75 opacity-0' : 'scale-100 opacity-100'}`}
                aria-hidden="true"
              >
                1
              </span>
              <span className="sr-only">{t('filters.appliedCount', { count: 1 })}</span>
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
                className={`-ml-px rounded-l-none transition-[opacity,transform] duration-150 ${isClearing ? 'translate-x-1 opacity-0' : 'translate-x-0 opacity-100'}`}
                aria-label={t('filters.clear')}
                onClick={clearFilters}
              >
                <RotateCcw className="size-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6}>
              {t('filters.clear')}
            </TooltipContent>
          </Tooltip>
        ) : null}
      </div>
      <TableFilterDialog
        open={open}
        onOpenChange={setOpen}
        value={currentValue}
        createDraft={(current) => ({ ...current })}
        createEmptyValue={() => ({ billingStatus: null })}
        isEqual={(left, right) => left.billingStatus === right.billingStatus}
        hasActiveCriteria={(current) => Boolean(current.billingStatus)}
        onApply={(draft) => onChange(draft.billingStatus)}
        labels={{
          title: t('filters.title'),
          clear: t('filters.clear'),
          cancel: t('filters.cancel'),
          apply: t('filters.apply'),
          showAll: t('filters.showAll'),
        }}
      >
        {({ draft, setDraft }) => (
          <TableFilterSection
            title={t('filters.sectionTitle')}
            description={t('filters.sectionDescription')}
          >
            <TableFilterSelect
              label={t('filters.billingStatus')}
              options={options.filter(
                (option) => option.value === 'SUBMITTED' || option.value === 'INVOICED'
              )}
              selectedValues={draft.billingStatus ? [draft.billingStatus] : []}
              onSelectedValuesChange={(values) =>
                setDraft(() => ({
                  billingStatus:
                    (values[0] as BillingCustomerServiceRecordStatus | undefined) ?? null,
                }))
              }
              placeholder={t('filters.placeholder')}
              orientation="responsive"
              loading={optionsStatus === 'loading'}
              loadingMessage={t('filters.loadingOptions')}
              emptyMessage={optionsError ?? t('filters.emptyOptions')}
            />
            {optionsError ? (
              <Button type="button" size="sm" variant="outline" onClick={onRetryOptions}>
                {t('actions.retry')}
              </Button>
            ) : null}
          </TableFilterSection>
        )}
      </TableFilterDialog>
    </>
  );
}
