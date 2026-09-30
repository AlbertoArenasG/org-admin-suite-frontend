'use client';

import { Filter } from 'lucide-react';
import { useState } from 'react';

import {
  TableFilterDialog,
  TableFilterSection,
  TableFilterSelect,
} from '@/components/table-filter';
import { Button } from '@/components/ui/button';
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

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Filter className="size-4" aria-hidden="true" />
        {t('filters.trigger')}
        {hasActiveCriteria(filters) ? (
          <span
            className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
            aria-hidden="true"
          >
            1
          </span>
        ) : null}
        {hasActiveCriteria(filters) ? (
          <span className="sr-only">{t('filters.appliedCount', { count: 1 })}</span>
        ) : null}
      </Button>

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
