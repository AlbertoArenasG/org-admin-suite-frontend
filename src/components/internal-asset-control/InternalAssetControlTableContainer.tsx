'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAuthorization } from '@/features/auth';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { InternalAssetControlDataTable } from '@/components/internal-asset-control/InternalAssetControlDataTable';
import { useInternalAssetControlTableColumns } from '@/components/internal-asset-control/useInternalAssetControlTableColumns';
import { useInternalAssetControlTableData } from '@/components/internal-asset-control/useInternalAssetControlTableData';
import { useInternalAssetControlTableStore } from '@/components/internal-asset-control/useInternalAssetControlTableStore';
import { buildInternalAssetControlDeleteTarget } from '@/components/internal-asset-control/types';
import {
  deleteInternalAssetMaintenanceRecord,
  fetchInternalAssetMaintenanceCatalog,
  fetchInternalAssetMaintenanceRecords,
} from '@/features/internal-asset-control/internalAssetControlThunks';
import { resetInternalAssetControlMutations } from '@/features/internal-asset-control/internalAssetControlSlice';
import {
  buildInternalAssetControlQuery,
  mapInternalAssetControlSortingToApi,
  parseInternalAssetControlSortingFromParams,
} from '@/utils/internalAssetControlQuery';

function getInitialPagination(params: URLSearchParams) {
  const initialPage = Number(params.get('page'));
  const initialLimit = Number(params.get('limit'));
  return {
    pageIndex: Number.isFinite(initialPage) && initialPage > 0 ? initialPage - 1 : 0,
    pageSize: Number.isFinite(initialLimit) && initialLimit > 0 ? initialLimit : 10,
  };
}

export function InternalAssetControlTableContainer() {
  const { t, hydrated, i18n } = useTranslationHydrated('internalAssetControl');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const { showSnackbar } = useSnackbar();
  const { hasPermission } = useAuthorization();

  const listState = useAppSelector((state) => state.internalAssetControl.list);
  const catalogsState = useAppSelector((state) => state.internalAssetControl.catalogs);
  const mutationsState = useAppSelector((state) => state.internalAssetControl.mutations);

  const paginationState = useInternalAssetControlTableStore((state) => state.pagination);
  const sorting = useInternalAssetControlTableStore((state) => state.sorting);
  const columnVisibility = useInternalAssetControlTableStore((state) => state.columnVisibility);
  const globalFilter = useInternalAssetControlTableStore((state) => state.globalFilter);
  const debouncedFilter = useInternalAssetControlTableStore((state) => state.debouncedFilter);
  const filters = useInternalAssetControlTableStore((state) => state.filters);
  const deleteTarget = useInternalAssetControlTableStore((state) => state.deleteTarget);
  const initialized = useInternalAssetControlTableStore((state) => state.initialized);

  const setPaginationState = useInternalAssetControlTableStore((state) => state.setPagination);
  const setSorting = useInternalAssetControlTableStore((state) => state.setSorting);
  const setColumnVisibility = useInternalAssetControlTableStore(
    (state) => state.setColumnVisibility
  );
  const setGlobalFilter = useInternalAssetControlTableStore((state) => state.setGlobalFilter);
  const setDebouncedFilter = useInternalAssetControlTableStore((state) => state.setDebouncedFilter);
  const setDeleteTarget = useInternalAssetControlTableStore((state) => state.setDeleteTarget);
  const syncFromUrl = useInternalAssetControlTableStore((state) => state.syncFromUrl);
  const resetTableStore = useInternalAssetControlTableStore((state) => state.reset);

  const canRead = hasPermission('INTERNAL_ASSET_MAINTENANCE_RECORDS', 'READ');
  const canCreate = hasPermission('INTERNAL_ASSET_MAINTENANCE_RECORDS', 'CREATE');
  const canUpdate = hasPermission('INTERNAL_ASSET_MAINTENANCE_RECORDS', 'UPDATE');
  const canDelete = hasPermission('INTERNAL_ASSET_MAINTENANCE_RECORDS', 'DELETE');

  useEffect(() => () => resetTableStore(), [resetTableStore]);

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    const nextPagination = getInitialPagination(params);
    const nextFilter = params.get('search') ?? '';
    const nextSorting = parseInternalAssetControlSortingFromParams(params);
    const nextStatus = params.get('status');
    const nextType = params.get('asset_maintenance_type');
    const nextSentToProvider = params.get('sent_to_provider');

    syncFromUrl({
      pagination: nextPagination,
      sorting: nextSorting.length ? nextSorting : [{ id: 'createdAt', desc: true }],
      globalFilter: nextFilter,
      debouncedFilter: nextFilter.trim(),
      filters: {
        assetMaintenanceType:
          nextType === 'CALIBRATION' ||
          nextType === 'VERIFICATION' ||
          nextType === 'PREVENTIVE_MAINTENANCE'
            ? nextType
            : null,
        status:
          nextStatus === 'PENDING' ||
          nextStatus === 'IN_PROGRESS' ||
          nextStatus === 'COMPLETED' ||
          nextStatus === 'CANCELLED' ||
          nextStatus === 'DELETED'
            ? nextStatus
            : null,
        expirationStatusPolicyId: null,
        expirationNotificationPolicyId: null,
        sentToProvider:
          nextSentToProvider === 'true' ? true : nextSentToProvider === 'false' ? false : null,
      },
    });
  }, [searchParamsString, syncFromUrl]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedFilter(globalFilter.trim());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [globalFilter, setDebouncedFilter]);

  useEffect(() => {
    if (!canRead || catalogsState.status !== 'idle') {
      return;
    }

    void dispatch(fetchInternalAssetMaintenanceCatalog());
  }, [canRead, catalogsState.status, dispatch]);

  useEffect(() => {
    if (!initialized || !canRead) {
      return;
    }

    void dispatch(
      fetchInternalAssetMaintenanceRecords({
        page: paginationState.pageIndex + 1,
        limit: paginationState.pageSize,
        itemsPerPage: paginationState.pageSize,
        search: debouncedFilter,
        filters,
        sorts: mapInternalAssetControlSortingToApi(sorting),
      })
    );
  }, [
    canRead,
    debouncedFilter,
    dispatch,
    filters,
    initialized,
    paginationState.pageIndex,
    paginationState.pageSize,
    sorting,
  ]);

  useEffect(() => {
    if (!initialized) {
      return;
    }

    const baseParams = new URLSearchParams(searchParamsString);
    const nextParams = buildInternalAssetControlQuery({
      pageIndex: paginationState.pageIndex,
      pageSize: paginationState.pageSize,
      search: globalFilter,
      sorting,
      filters,
      baseParams,
    });

    if (nextParams.toString() === searchParamsString) {
      return;
    }

    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  }, [
    filters,
    globalFilter,
    initialized,
    paginationState.pageIndex,
    paginationState.pageSize,
    pathname,
    router,
    searchParamsString,
    sorting,
  ]);

  useEffect(() => {
    if (!initialized || !listState.totalPages) {
      return;
    }

    const totalPages = Math.max(1, listState.totalPages);
    const maxPageIndex = Math.max(0, totalPages - 1);
    const serverPageSize = listState.perPage;

    setPaginationState((current) => {
      const nextPageIndex = current.pageIndex > maxPageIndex ? maxPageIndex : current.pageIndex;
      const nextPageSize = serverPageSize > 0 ? serverPageSize : current.pageSize;

      if (nextPageIndex === current.pageIndex && nextPageSize === current.pageSize) {
        return current;
      }

      return { pageIndex: nextPageIndex, pageSize: nextPageSize };
    });
  }, [initialized, listState.perPage, listState.totalPages, setPaginationState]);

  useEffect(() => {
    if (mutationsState.deleteStatus === 'succeeded' && mutationsState.currentRecordId) {
      showSnackbar({
        message: mutationsState.message ?? t('delete.success'),
        severity: 'success',
      });
      setDeleteTarget(null);
      dispatch(resetInternalAssetControlMutations());
      void dispatch(
        fetchInternalAssetMaintenanceRecords({
          page: paginationState.pageIndex + 1,
          limit: paginationState.pageSize,
          itemsPerPage: paginationState.pageSize,
          search: debouncedFilter,
          filters,
          sorts: mapInternalAssetControlSortingToApi(sorting),
        })
      );
      return;
    }

    if (mutationsState.deleteStatus === 'failed') {
      showSnackbar({
        message: mutationsState.error ?? t('delete.error'),
        severity: 'error',
      });
      dispatch(resetInternalAssetControlMutations());
    }
  }, [
    debouncedFilter,
    dispatch,
    filters,
    mutationsState,
    paginationState.pageIndex,
    paginationState.pageSize,
    setDeleteTarget,
    showSnackbar,
    sorting,
    t,
  ]);

  const dateFormatter = useMemo(() => {
    const fallback = i18n.options.fallbackLng;
    const fallbackLang = Array.isArray(fallback)
      ? fallback[0]
      : typeof fallback === 'string'
        ? fallback
        : 'es';
    const locale = hydrated ? i18n.language : fallbackLang;
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });
  }, [hydrated, i18n.language, i18n.options.fallbackLng]);

  const tableData = useInternalAssetControlTableData(listState.items, t);
  const columns = useInternalAssetControlTableColumns({
    t,
    dateFormatter,
    canUpdate,
    canDelete,
    onDelete: (record) => setDeleteTarget(buildInternalAssetControlDeleteTarget(record)),
  });

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      columnVisibility,
      globalFilter,
      pagination: paginationState,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPaginationState,
    autoResetAll: false,
    autoResetPageIndex: false,
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.max(listState.totalPages, 1),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const retryListFetch = () => {
    if (!canRead) {
      return;
    }

    void dispatch(
      fetchInternalAssetMaintenanceRecords({
        page: paginationState.pageIndex + 1,
        limit: paginationState.pageSize,
        itemsPerPage: paginationState.pageSize,
        search: debouncedFilter,
        filters,
        sorts: mapInternalAssetControlSortingToApi(sorting),
      })
    );
  };

  return (
    <InternalAssetControlDataTable
      table={table}
      catalogs={catalogsState.item}
      isLoading={listState.status === 'loading'}
      error={listState.error}
      errorTitle={t('errors.title')}
      onRetry={listState.error ? retryListFetch : undefined}
      retryLabel={t('actions.retry')}
      onCreateClick={() => router.push('/dashboard/internal-asset-control/new')}
      canCreate={canCreate}
      title={t('list.title')}
      createLabel={t('list.createShort')}
      createAriaLabel={t('list.createShort')}
      paginationSummary={`${t('list.title')} · ${listState.total}`}
      deleteDialog={{
        open: Boolean(deleteTarget),
        record: deleteTarget,
        onOpenChange: (open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        },
        onConfirm: () => {
          if (!deleteTarget) {
            return;
          }
          void dispatch(
            deleteInternalAssetMaintenanceRecord({
              internalAssetMaintenanceRecordId: deleteTarget.internalAssetMaintenanceRecordId,
            })
          );
        },
        isLoading: mutationsState.deleteStatus === 'loading',
        labels: {
          title: t('delete.title'),
          description: t('delete.description'),
          warning: t('delete.warning'),
          cancel: t('delete.cancel'),
          confirm: t('delete.confirm'),
        },
      }}
      toolbarLabels={{
        searchPlaceholder: t('list.searchPlaceholder'),
        columnLabel: t('actions.manageColumns'),
        assetMaintenanceTypePlaceholder: t('filters.assetMaintenanceTypePlaceholder'),
        statusPlaceholder: t('filters.statusPlaceholder'),
        sentToProviderPlaceholder: t('filters.sentToProviderPlaceholder'),
        sentToProviderYes: t('filters.sentToProviderYes'),
        sentToProviderNo: t('filters.sentToProviderNo'),
      }}
      tableLabels={{
        noData: t('list.empty'),
        pagination: {
          previous: t('actions.previous'),
          next: t('actions.next'),
        },
      }}
    />
  );
}
