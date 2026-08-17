'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { ExpirationStatusPoliciesDataTable } from '@/components/expiration-status-policies/ExpirationStatusPoliciesDataTable';
import { useExpirationStatusPoliciesTableColumns } from '@/components/expiration-status-policies/useExpirationStatusPoliciesTableColumns';
import { useExpirationStatusPoliciesTableData } from '@/components/expiration-status-policies/useExpirationStatusPoliciesTableData';
import { useExpirationStatusPoliciesTableStore } from '@/components/expiration-status-policies/useExpirationStatusPoliciesTableStore';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAuthorization } from '@/features/auth';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import {
  deleteExpirationStatusPolicy,
  fetchExpirationStatusPolicyCatalog,
  fetchExpirationStatusPolicies,
} from '@/features/expiration-status-policies/expirationStatusPoliciesThunks';
import { resetExpirationStatusPolicyMutations } from '@/features/expiration-status-policies/expirationStatusPoliciesSlice';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import {
  buildExpirationStatusPoliciesQuery,
  mapExpirationStatusPolicySortingToApi,
  parseExpirationStatusPolicySortingFromParams,
} from '@/utils/expirationStatusPoliciesQuery';

function getInitialPagination(params: URLSearchParams) {
  const initialPage = Number(params.get('page'));
  const initialLimit = Number(params.get('limit'));
  return {
    pageIndex: Number.isFinite(initialPage) && initialPage > 0 ? initialPage - 1 : 0,
    pageSize: Number.isFinite(initialLimit) && initialLimit > 0 ? initialLimit : 10,
  };
}

export function ExpirationStatusPoliciesTableContainer() {
  const { t, hydrated, i18n } = useTranslationHydrated('expirationStatusPolicies');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const { showSnackbar } = useSnackbar();
  const { hasPermission } = useAuthorization();

  const listState = useAppSelector((state) => state.expirationStatusPolicies.list);
  const catalogsState = useAppSelector((state) => state.expirationStatusPolicies.catalogs);
  const mutationsState = useAppSelector((state) => state.expirationStatusPolicies.mutations);

  const paginationState = useExpirationStatusPoliciesTableStore((state) => state.pagination);
  const sorting = useExpirationStatusPoliciesTableStore((state) => state.sorting);
  const columnVisibility = useExpirationStatusPoliciesTableStore((state) => state.columnVisibility);
  const globalFilter = useExpirationStatusPoliciesTableStore((state) => state.globalFilter);
  const debouncedFilter = useExpirationStatusPoliciesTableStore((state) => state.debouncedFilter);
  const filters = useExpirationStatusPoliciesTableStore((state) => state.filters);
  const deleteTarget = useExpirationStatusPoliciesTableStore((state) => state.deleteTarget);
  const initialized = useExpirationStatusPoliciesTableStore((state) => state.initialized);

  const setPaginationState = useExpirationStatusPoliciesTableStore((state) => state.setPagination);
  const setSorting = useExpirationStatusPoliciesTableStore((state) => state.setSorting);
  const setColumnVisibility = useExpirationStatusPoliciesTableStore(
    (state) => state.setColumnVisibility
  );
  const setGlobalFilter = useExpirationStatusPoliciesTableStore((state) => state.setGlobalFilter);
  const setDebouncedFilter = useExpirationStatusPoliciesTableStore(
    (state) => state.setDebouncedFilter
  );
  const setDeleteTarget = useExpirationStatusPoliciesTableStore((state) => state.setDeleteTarget);
  const syncFromUrl = useExpirationStatusPoliciesTableStore((state) => state.syncFromUrl);
  const resetTableStore = useExpirationStatusPoliciesTableStore((state) => state.reset);

  const canRead = hasPermission('EXPIRATION_STATUS_POLICIES', 'READ');
  const canCreate = hasPermission('EXPIRATION_STATUS_POLICIES', 'CREATE');
  const canUpdate = hasPermission('EXPIRATION_STATUS_POLICIES', 'UPDATE');
  const canDelete = hasPermission('EXPIRATION_STATUS_POLICIES', 'DELETE');

  useEffect(() => () => resetTableStore(), [resetTableStore]);

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    const nextPagination = getInitialPagination(params);
    const nextFilter = params.get('search') ?? '';
    const nextSorting = parseExpirationStatusPolicySortingFromParams(params);
    const nextStatus = params.get('status');

    syncFromUrl({
      pagination: nextPagination,
      sorting: nextSorting.length ? nextSorting : [{ id: 'createdAt', desc: true }],
      globalFilter: nextFilter,
      debouncedFilter: nextFilter.trim(),
      filters: {
        status: nextStatus === 'ACTIVE' || nextStatus === 'DELETED' ? nextStatus : null,
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

    void dispatch(fetchExpirationStatusPolicyCatalog());
  }, [canRead, catalogsState.status, dispatch]);

  useEffect(() => {
    if (!initialized || !canRead) {
      return;
    }

    void dispatch(
      fetchExpirationStatusPolicies({
        page: paginationState.pageIndex + 1,
        limit: paginationState.pageSize,
        itemsPerPage: paginationState.pageSize,
        search: debouncedFilter,
        filters,
        sorts: mapExpirationStatusPolicySortingToApi(sorting),
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
    const nextParams = buildExpirationStatusPoliciesQuery({
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
    if (
      mutationsState.deleteStatus === 'succeeded' &&
      mutationsState.currentExpirationStatusPolicyId
    ) {
      showSnackbar({
        message:
          mutationsState.message ??
          t('delete.success', {
            defaultValue: 'Política de estatus por vencimiento eliminada correctamente.',
          }),
        severity: 'success',
      });
      setDeleteTarget(null);
      dispatch(resetExpirationStatusPolicyMutations());
      void dispatch(
        fetchExpirationStatusPolicies({
          page: paginationState.pageIndex + 1,
          limit: paginationState.pageSize,
          itemsPerPage: paginationState.pageSize,
          search: debouncedFilter,
          filters,
          sorts: mapExpirationStatusPolicySortingToApi(sorting),
        })
      );
      return;
    }

    if (mutationsState.deleteStatus === 'failed') {
      showSnackbar({
        message:
          mutationsState.error ??
          t('delete.error', {
            defaultValue: 'No fue posible eliminar la política de estatus por vencimiento.',
          }),
        severity: 'error',
      });
      dispatch(resetExpirationStatusPolicyMutations());
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

  const tableData = useExpirationStatusPoliciesTableData(listState.items);
  const columns = useExpirationStatusPoliciesTableColumns({
    t,
    dateFormatter,
    canUpdate,
    canDelete,
    onDelete: (policy) => setDeleteTarget(policy),
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
    manualFiltering: true,
    pageCount: listState.totalPages ?? -1,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <ExpirationStatusPoliciesDataTable
      table={table}
      isLoading={listState.status === 'loading'}
      error={canRead ? listState.error : t('permissions.readRestricted')}
      onCreateClick={() => router.push('/dashboard/expiration-status-policies/new')}
      canCreate={canCreate}
      title={t('title')}
      createLabel={t('actions.createShort')}
      createAriaLabel={t('actions.create')}
      paginationSummary={
        canRead && listState.totalPages > 0
          ? t('pagination', {
              page: listState.page,
              pages: listState.totalPages,
              total: listState.total,
            })
          : null
      }
      searchPlaceholder={t('actions.searchPlaceholder')}
      columnLabel={t('actions.manageColumns')}
      statusLabel={t('filters.status')}
      statusPlaceholder={t('filters.statusPlaceholder')}
      statuses={catalogsState.statuses}
      deleteDialog={{
        open: Boolean(deleteTarget),
        policy: deleteTarget,
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
            deleteExpirationStatusPolicy({
              expirationStatusPolicyId: deleteTarget.expirationStatusPolicyId,
            })
          );
        },
        isLoading: mutationsState.deleteStatus === 'loading',
        labels: {
          title: t('confirmDelete.title'),
          description: t('confirmDelete.description', {
            name: deleteTarget?.name ?? '—',
          }),
          warning: t('confirmDelete.warning'),
          cancel: t('confirmDelete.cancel'),
          confirm: t('confirmDelete.confirm'),
        },
      }}
      tableLabels={{
        noData: t('empty'),
        pagination: {
          previous: t('actions.previous'),
          next: t('actions.next'),
        },
      }}
    />
  );
}
