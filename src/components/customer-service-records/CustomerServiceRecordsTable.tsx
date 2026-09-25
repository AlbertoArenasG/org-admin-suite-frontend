'use client';

import { useMemo } from 'react';
import type { ReactNode } from 'react';

import { DataTable, type DataTableRowActions } from '@/components/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import type { CustomerServiceRecordListItem } from '@/features/customer-service-records';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import type { CustomerServiceRecordsTableSorting } from '@/utils/customerServiceRecordsQuery';
import { CustomerServiceRecordsFilterDialog } from './CustomerServiceRecordsFilterDialog';
import {
  CustomerServiceRecordsObservationsDetail,
  hasCustomerServiceRecordObservations,
} from './CustomerServiceRecordsObservationsDetail';
import { createCustomerServiceRecordsColumns } from './customerServiceRecordsColumns';
import type { CustomerServiceRecordsListController } from './useCustomerServiceRecordsListController';

const SORTABLE_COLUMN_IDS = [
  'serviceNumber',
  'receivedAt',
  'estimatedDeliveryAt',
  'providerReturn',
] as const;

function isSortableColumnId(
  columnId: string
): columnId is CustomerServiceRecordsTableSorting['columnId'] {
  return (SORTABLE_COLUMN_IDS as readonly string[]).includes(columnId);
}

function loadingCell(columnId: string) {
  const width =
    columnId === 'serviceAndAssets'
      ? 'w-4/5'
      : columnId === 'customerCommitment' || columnId === 'operationalStatus'
        ? 'w-3/5'
        : 'w-2/3';
  return <Skeleton className={`h-5 ${width}`} />;
}

type CustomerServiceRecordsTableProps = {
  controller: CustomerServiceRecordsListController;
  rowActions: DataTableRowActions<CustomerServiceRecordListItem>;
  primaryActions?: ReactNode;
};

export function CustomerServiceRecordsTable({
  controller,
  primaryActions,
  rowActions,
}: CustomerServiceRecordsTableProps) {
  const { t, hydrated, i18n } = useTranslationHydrated('customerServiceRecords');
  const {
    list,
    options,
    customerOptions,
    page,
    limit,
    search,
    appliedSearch,
    sorting,
    visibleColumnIds,
    expandedRowIds,
    filters,
    setPage,
    setLimit,
    setSearch,
    setAppliedSearch,
    setSorting,
    setVisibleColumnIds,
    setExpandedRowIds,
    setFilters,
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
      createCustomerServiceRecordsColumns({
        dateFormatter,
        labels: {
          serviceNumber: t('table.columns.serviceNumber'),
          serviceAndAssets: t('table.columns.serviceAndAssets'),
          equipmentDetails: t('table.columns.equipmentDetails'),
          operationalStatus: t('table.columns.status'),
          customerCommitment: t('table.columns.customerDelivery'),
          receivedAt: t('table.columns.receivedAt'),
          deliveryAt: t('table.columns.deliveryAt'),
          customer: t('table.columns.customer'),
          providerTracking: t('table.columns.providerTracking'),
          providerReturn: t('table.columns.providerReturn'),
          noDate: t('labels.noDate'),
          noStatus: t('labels.neutral'),
          noProvider: t('filters.providerStateNo'),
          estimated: t('table.values.estimated'),
          delivered: t('table.values.delivered'),
        },
      }),
    [dateFormatter, t]
  );

  return (
    <DataTable
      rows={list.items}
      columns={columns}
      getRowId={(row) => row.customerServiceRecordId}
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
          <CustomerServiceRecordsFilterDialog
            filters={filters}
            serviceTypes={options.serviceTypes}
            customers={customerOptions.items.map((item) => ({
              value: item.id,
              label: item.companyName,
            }))}
            providers={options.providers}
            loadingOptions={options.status === 'loading' || customerOptions.status === 'loading'}
            onFiltersChange={(nextFilters) => {
              setFilters(nextFilters);
              setPage(1);
            }}
          />
        ),
        primaryActions,
      }}
      settings={{
        columnVisibility: { visibleColumnIds, onChange: setVisibleColumnIds },
      }}
      settingsPlacement="toolbar"
      scrollRegion={{ maxHeight: 'available', desktopOnly: true, overscrollBehavior: 'none' }}
      stickyHeader={{ desktopOnly: true }}
      rowLayout="multiline"
      sorting={{
        columnId: sorting?.columnId,
        direction: sorting?.direction,
        onChange: (next) => {
          if (!next) {
            setSorting(null);
            setPage(1);
            return;
          }
          if (!isSortableColumnId(next.columnId)) return;
          setSorting({ columnId: next.columnId, direction: next.direction });
          setPage(1);
        },
      }}
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
        pageSizes: [10, 25, 50],
      }}
      expansion={{
        expandedRowIds,
        onChange: setExpandedRowIds,
        isRowExpandable: hasCustomerServiceRecordObservations,
        trigger: 'feedback',
        ariaLabel: t('expansion.ariaLabel'),
      }}
      renderDetail={(row) => (
        <CustomerServiceRecordsObservationsDetail
          row={row}
          labels={{
            general: t('expansion.generalObservations'),
            assets: t('expansion.assetObservations'),
          }}
        />
      )}
      getRowVisual={(row) => {
        const color = row.customerDelivery.statusMaterialization?.colorHex;
        return color ? { indicatorColor: color } : undefined;
      }}
      searchHighlight={{
        query: appliedSearch,
        columnIds: ['serviceNumber', 'serviceAndAssets', 'equipmentDetails', 'customer'],
      }}
      rowActions={rowActions}
      labels={{
        loading: t('list.loading'),
        loadingResults: t('table.loadingResults'),
        settings: t('table.settings'),
        displayColumns: t('table.displayColumns'),
        resizeColumn: (column) => t('table.resizeColumn', { column }),
        additionalDetails: t('expansion.ariaLabel'),
        noResults: t('list.emptyTitle'),
        noResultsForCriteria: t('list.emptyFilteredTitle'),
        clearCriteria: t('list.clearCriteria'),
        pagination: t('table.pagination'),
        rowsPerPage: t('table.rowsPerPage'),
        paginationSummary: ({ from, to, total }) =>
          t('table.paginationSummary', { from, to, total }),
        previousPage: t('table.previousPage'),
        nextPage: t('table.nextPage'),
        clearSearch: t('list.clearSearch'),
        rowActions: t('table.rowActions'),
      }}
    />
  );
}
