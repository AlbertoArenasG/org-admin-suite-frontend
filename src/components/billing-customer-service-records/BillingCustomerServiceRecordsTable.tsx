'use client';

import { useMemo } from 'react';

import { DataTable, type DataTableRowActions } from '@/components/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import type { BillingCustomerServiceRecordRow } from '@/features/billing-customer-service-records';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { BillingCustomerServiceRecordsFilterDialog } from './BillingCustomerServiceRecordsFilterDialog';
import { createBillingCustomerServiceRecordsColumns } from './billingCustomerServiceRecordsColumns';
import type { BillingCustomerServiceRecordsListController } from './useBillingCustomerServiceRecordsListController';

type Props = {
  controller: BillingCustomerServiceRecordsListController;
  rowActions: DataTableRowActions<BillingCustomerServiceRecordRow>;
};

export function BillingCustomerServiceRecordsTable({ controller, rowActions }: Props) {
  const { t } = useTranslationHydrated('billingCustomerServiceRecords');
  const {
    list,
    options,
    page,
    limit,
    search,
    appliedSearch,
    billingStatus,
    visibleColumnIds,
    setPage,
    setLimit,
    setSearch,
    setAppliedSearch,
    setBillingStatus,
    setVisibleColumnIds,
    refetch,
    refetchOptions,
    clearCriteria,
    hasActiveCriteria,
  } = controller;

  const columns = useMemo(
    () =>
      createBillingCustomerServiceRecordsColumns({
        serviceNumber: t('table.columns.serviceNumber'),
        customer: t('table.columns.customer'),
        equipment: t('table.columns.equipment'),
        serviceType: t('table.columns.serviceType'),
        billingStatus: t('table.columns.billingStatus'),
        noEquipment: t('table.noEquipment'),
      }),
    [t]
  );

  return (
    <DataTable
      rows={list.items}
      columns={columns}
      getRowId={(row) => row.customerServiceRecordId}
      loading={list.status === 'loading'}
      renderLoading={(columnId) => (
        <Skeleton className={`h-5 ${columnId === 'equipment' ? 'w-4/5' : 'w-2/3'}`} />
      )}
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
          <BillingCustomerServiceRecordsFilterDialog
            value={billingStatus}
            options={options.items}
            optionsStatus={options.status}
            optionsError={options.error}
            onRetryOptions={refetchOptions}
            onChange={(next) => {
              setBillingStatus(next);
              setPage(1);
            }}
          />
        ),
      }}
      settings={{ columnVisibility: { visibleColumnIds, onChange: setVisibleColumnIds } }}
      settingsPlacement="toolbar"
      scrollRegion={{ maxHeight: 'available', desktopOnly: true, overscrollBehavior: 'none' }}
      stickyHeader={{ desktopOnly: true }}
      rowLayout="single-line"
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
        columnIds: ['serviceNumber', 'customer', 'equipment', 'serviceType'],
      }}
      rowActions={rowActions}
      labels={{
        loading: t('list.loading'),
        loadingResults: t('table.loadingResults'),
        settings: t('table.settings'),
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
