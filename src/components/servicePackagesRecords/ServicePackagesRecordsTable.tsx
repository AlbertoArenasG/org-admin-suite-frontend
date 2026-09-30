'use client';

import { useMemo } from 'react';

import { DataTable, type DataTableRowActions } from '@/components/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import type { ServicePackageRecordListItem } from '@/features/servicePackagesRecords';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { useDataTablePreferencesStore } from '@/stores/useDataTablePreferencesStore';
import { createServicePackagesRecordsColumns } from './servicePackagesRecordsColumns';
import { ServicePackagesRecordsFilterDialog } from './ServicePackagesRecordsFilterDialog';
import type { ServicePackagesRecordsListController } from './useServicePackagesRecordsListController';

type ServicePackagesRecordsTableProps = {
  controller: ServicePackagesRecordsListController;
  rowActions: DataTableRowActions<ServicePackageRecordListItem>;
};

function loadingCell(columnId: string) {
  const width = columnId === 'company' ? 'w-4/5' : 'w-2/3';
  return <Skeleton className={`h-5 ${width}`} />;
}

export function ServicePackagesRecordsTable({
  controller,
  rowActions,
}: ServicePackagesRecordsTableProps) {
  const { t, hydrated, i18n } = useTranslationHydrated('servicePackagesRecords');
  const density = useDataTablePreferencesStore((state) => state.density);
  const setDensity = useDataTablePreferencesStore((state) => state.setDensity);
  const {
    list,
    options,
    page,
    limit,
    search,
    appliedSearch,
    filters,
    visibleColumnIds,
    setPage,
    setLimit,
    setSearch,
    setAppliedSearch,
    setFilters,
    setVisibleColumnIds,
    refetch,
    clearCriteria,
    hasActiveCriteria,
  } = controller;

  const dateFormatter = useMemo(() => {
    const fallback = i18n.options.fallbackLng;
    const language = hydrated
      ? i18n.language
      : Array.isArray(fallback)
        ? fallback[0]
        : fallback || 'es';
    return new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeZone: 'UTC' });
  }, [hydrated, i18n.language, i18n.options.fallbackLng]);

  const columns = useMemo(
    () =>
      createServicePackagesRecordsColumns({
        dateFormatter,
        density,
        labels: {
          serviceOrder: t('table.columns.serviceOrder'),
          serviceType: t('table.columns.serviceType'),
          company: t('table.columns.company'),
          collector: t('table.columns.collector'),
          visitDate: t('table.columns.visitDate'),
          createdAt: t('table.columns.createdAt'),
          empty: t('labels.empty'),
        },
      }),
    [dateFormatter, density, t]
  );

  return (
    <DataTable
      rows={list.items}
      columns={columns}
      getRowId={(row) => row.id}
      loading={list.status === 'loading'}
      renderLoading={(columnId) => loadingCell(columnId)}
      error={
        list.status === 'failed' && list.error
          ? { message: list.error, onRetry: refetch }
          : undefined
      }
      hasActiveCriteria={hasActiveCriteria}
      onClearCriteria={clearCriteria}
      renderEmpty={({ filtered, onClearCriteria }) => (
        <div className="mx-auto max-w-sm space-y-2">
          <p className="font-medium text-foreground">
            {filtered ? t('list.emptyFilteredTitle') : t('list.emptyTitle')}
          </p>
          <p>{filtered ? t('list.emptyFilteredDescription') : t('list.emptyDescription')}</p>
          {filtered && onClearCriteria ? (
            <button
              type="button"
              className="font-medium text-primary underline"
              onClick={onClearCriteria}
            >
              {t('list.clearCriteria')}
            </button>
          ) : null}
        </div>
      )}
      toolbar={{
        compact: true,
        search: {
          value: search,
          onChange: (value) => {
            setSearch(value);
            if (!value) setAppliedSearch('');
            setPage(1);
          },
          placeholder: t('filters.searchPlaceholder'),
          ariaLabel: t('filters.searchPlaceholder'),
        },
        trailing: (
          <ServicePackagesRecordsFilterDialog
            filters={filters}
            serviceTypes={options.serviceTypes}
            loadingOptions={options.status === 'loading'}
            onFiltersChange={(nextFilters) => {
              setFilters(nextFilters);
              setPage(1);
            }}
          />
        ),
      }}
      settings={{
        density: { value: density, onChange: setDensity },
        columnVisibility: { visibleColumnIds, onChange: setVisibleColumnIds },
      }}
      settingsPlacement="toolbar"
      scrollRegion={{ maxHeight: 'available', desktopOnly: true, overscrollBehavior: 'none' }}
      stickyHeader={{ desktopOnly: true }}
      rowLayout="single-line"
      density={density}
      pagination={{
        page,
        perPage: limit,
        total: list.total,
        totalPages: list.totalPages,
        onChange: setPage,
        onPerPageChange: (nextLimit) => {
          setLimit(nextLimit);
          setPage(1);
        },
        pageSizes: [10, 25, 50, 75],
      }}
      searchHighlight={{
        query: appliedSearch,
        columnIds: ['serviceOrder', 'serviceType', 'company', 'collectorName'],
      }}
      rowActions={rowActions}
      labels={{
        loading: t('list.loading'),
        loadingResults: t('table.loadingResults'),
        settings: t('table.settings'),
        density: t('table.density'),
        compact: t('table.compact'),
        comfortable: t('table.comfortable'),
        displayColumns: t('table.displayColumns'),
        resizeColumn: (column) => t('table.resizeColumn', { column }),
        noResults: t('list.emptyTitle'),
        noResultsForCriteria: t('list.emptyFilteredTitle'),
        clearCriteria: t('list.clearCriteria'),
        pagination: t('table.pagination'),
        rowsPerPage: t('table.rowsPerPage'),
        paginationSummary: ({ from, to, total }) =>
          t('table.paginationSummary', { from, to, total }),
        previousPage: t('table.previousPage'),
        nextPage: t('table.nextPage'),
        clearSearch: t('list.clearCriteria'),
        rowActions: t('table.rowActions'),
      }}
    />
  );
}
