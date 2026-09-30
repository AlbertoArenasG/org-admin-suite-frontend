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
import type {
  ServicePackageRecordServiceTypeOption,
  ServicePackagesRecordsListFilters,
} from '@/features/servicePackagesRecords';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

type ServicePackagesRecordsFilterDialogProps = {
  filters: ServicePackagesRecordsListFilters;
  serviceTypes: ServicePackageRecordServiceTypeOption[];
  loadingOptions: boolean;
  onFiltersChange: (filters: ServicePackagesRecordsListFilters) => void;
};

function isEqual(
  left: ServicePackagesRecordsListFilters,
  right: ServicePackagesRecordsListFilters
) {
  return left.serviceType === right.serviceType;
}

function hasActiveCriteria(filters: ServicePackagesRecordsListFilters) {
  return Boolean(filters.serviceType);
}

export function ServicePackagesRecordsFilterDialog({
  filters,
  serviceTypes,
  loadingOptions,
  onFiltersChange,
}: ServicePackagesRecordsFilterDialogProps) {
  const { t } = useTranslationHydrated('servicePackagesRecords');
  const [open, setOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const clearTimerRef = useRef<number | null>(null);
  const appliedFilterCount = hasActiveCriteria(filters) ? 1 : 0;

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
      onFiltersChange({ serviceType: null });
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
                className={`inline-flex size-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground transition-[opacity,transform] duration-150 ${
                  isClearing ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
                }`}
                aria-hidden="true"
              >
                {appliedFilterCount}
              </span>
              <span className="sr-only">
                {t('filters.appliedCount', { count: appliedFilterCount })}
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
                aria-label={t('filters.clear')}
                onClick={handleClearFilters}
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
        value={filters}
        createDraft={(value) => ({ ...value })}
        createEmptyValue={() => ({ serviceType: null })}
        isEqual={isEqual}
        hasActiveCriteria={hasActiveCriteria}
        onApply={onFiltersChange}
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
            title={t('filters.serviceTypeSectionTitle')}
            description={t('filters.serviceTypeSectionDescription')}
          >
            <TableFilterSelect
              label={t('filters.serviceType')}
              options={serviceTypes}
              selectedValues={draft.serviceType ? [draft.serviceType] : []}
              onSelectedValuesChange={(values) =>
                setDraft((current) => ({ ...current, serviceType: values[0] ?? null }))
              }
              placeholder={t('filters.serviceTypePlaceholder')}
              orientation="responsive"
              searchable
              searchPlaceholder={t('filters.searchOptions')}
              loading={loadingOptions}
              loadingMessage={t('filters.loadingOptions')}
              emptyMessage={t('filters.emptyOptions')}
            />
          </TableFilterSection>
        )}
      </TableFilterDialog>
    </>
  );
}
