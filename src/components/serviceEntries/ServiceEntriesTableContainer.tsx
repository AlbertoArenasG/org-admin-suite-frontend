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
import { ServiceEntriesDataTable } from '@/components/serviceEntries/ServiceEntriesDataTable';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import Paper from '@mui/material/Paper';
import { Skeleton } from '@/components/ui/skeleton';
import {
  fetchServiceEntries,
  deleteServiceEntry,
} from '@/features/serviceEntries/serviceEntriesThunks';
import { parseUserRole } from '@/features/users/roles';
import { mapServiceEntrySortingToApi } from '@/utils/serviceEntriesQuery';
import { useServiceEntriesTableData } from '@/components/serviceEntries/useServiceEntriesTableData';
import { useServiceEntriesTableColumns } from '@/components/serviceEntries/useServiceEntriesTableColumns';
import { useServiceEntriesTableStore } from '@/components/serviceEntries/useServiceEntriesTableStore';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { resetServiceEntryDelete } from '@/features/serviceEntries/serviceEntriesSlice';

function getInitialPagination(params: URLSearchParams) {
  const initialPage = Number(params.get('page'));
  const initialLimit = Number(params.get('limit'));
  return {
    pageIndex: Number.isFinite(initialPage) && initialPage > 0 ? initialPage - 1 : 0,
    pageSize: Number.isFinite(initialLimit) && initialLimit > 0 ? initialLimit : 10,
  };
}

export function ServiceEntriesTableContainer() {
  const { t, hydrated, i18n } = useTranslationHydrated('common');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  const {
    entities,
    status,
    error,
    pagination,
    delete: deleteState,
  } = useAppSelector((state) => state.serviceEntries);
  const authUser = useAppSelector((state) => state.auth.user);

  const paginationState = useServiceEntriesTableStore((state) => state.pagination);
  const sorting = useServiceEntriesTableStore((state) => state.sorting);
  const columnVisibility = useServiceEntriesTableStore((state) => state.columnVisibility);
  const globalFilter = useServiceEntriesTableStore((state) => state.globalFilter);
  const debouncedFilter = useServiceEntriesTableStore((state) => state.debouncedFilter);
  const deleteTargetId = useServiceEntriesTableStore((state) => state.deleteTargetId);
  const initialized = useServiceEntriesTableStore((state) => state.initialized);

  const setPaginationState = useServiceEntriesTableStore((state) => state.setPagination);
  const setSorting = useServiceEntriesTableStore((state) => state.setSorting);
  const setColumnVisibility = useServiceEntriesTableStore((state) => state.setColumnVisibility);
  const setGlobalFilter = useServiceEntriesTableStore((state) => state.setGlobalFilter);
  const setDebouncedFilter = useServiceEntriesTableStore((state) => state.setDebouncedFilter);
  const setDeleteTargetId = useServiceEntriesTableStore((state) => state.setDeleteTargetId);
  const syncFromUrl = useServiceEntriesTableStore((state) => state.syncFromUrl);
  const setInitialized = useServiceEntriesTableStore((state) => state.setInitialized);
  const resetTableStore = useServiceEntriesTableStore((state) => state.reset);
  const { showSnackbar } = useSnackbar();

  useEffect(() => () => resetTableStore(), [resetTableStore]);

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    const nextPagination = getInitialPagination(params);
    const nextFilter = params.get('search') ?? '';
    const nextSorting = params.getAll('sort').length ? [] : parseSortingFromParams(params);
    syncFromUrl({
      pagination: nextPagination,
      sorting: nextSorting,
      globalFilter: nextFilter,
      debouncedFilter: nextFilter.trim(),
    });
    setInitialized(true);
  }, [searchParamsString, syncFromUrl, setInitialized]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedFilter(globalFilter.trim());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [globalFilter, setDebouncedFilter]);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    void dispatch(
      fetchServiceEntries({
        page: paginationState.pageIndex + 1,
        limit: paginationState.pageSize,
        search: debouncedFilter,
        sorts: mapServiceEntrySortingToApi(sorting),
      })
    );
  }, [
    debouncedFilter,
    dispatch,
    paginationState.pageIndex,
    paginationState.pageSize,
    sorting,
    initialized,
  ]);

  useEffect(() => {
    if (!pagination || !initialized) {
      return;
    }
    const totalPages = Math.max(1, pagination.totalPages);
    const maxPageIndex = Math.max(0, totalPages - 1);
    setPaginationState((current) => {
      const nextPageIndex = current.pageIndex > maxPageIndex ? maxPageIndex : current.pageIndex;
      const nextPageSize = pagination.perPage > 0 ? pagination.perPage : current.pageSize;
      if (nextPageIndex === current.pageIndex && nextPageSize === current.pageSize) {
        return current;
      }
      return { pageIndex: nextPageIndex, pageSize: nextPageSize };
    });
  }, [initialized, pagination, setPaginationState]);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    const params = new URLSearchParams(searchParamsString);
    const nextParams = new URLSearchParams();
    nextParams.set('page', String(paginationState.pageIndex + 1));
    nextParams.set('limit', String(paginationState.pageSize));
    if (globalFilter.trim()) {
      nextParams.set('search', globalFilter.trim());
    }
    mapServiceEntrySortingToApi(sorting).forEach((sort, index) => {
      nextParams.set(`sort[${index}][field]`, sort.field);
      nextParams.set(`sort[${index}][direction]`, sort.direction);
    });
    if (nextParams.toString() === params.toString()) {
      return;
    }
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  }, [
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
    if (deleteState.status === 'succeeded') {
      showSnackbar({
        message:
          deleteState.message ??
          t('serviceEntries.delete.success', { defaultValue: 'Service entry deleted.' }),
        severity: 'success',
      });
      setDeleteTargetId(null);
      dispatch(resetServiceEntryDelete());
    } else if (deleteState.status === 'failed') {
      showSnackbar({
        message:
          deleteState.error ??
          t('serviceEntries.delete.error', { defaultValue: 'Unable to delete the service entry.' }),
        severity: 'error',
      });
      dispatch(resetServiceEntryDelete());
    }
  }, [deleteState, dispatch, setDeleteTargetId, showSnackbar, t]);

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

  const tableData = useServiceEntriesTableData(entities);
  const currentRole = authUser ? parseUserRole(authUser.role) : null;

  const columns = useServiceEntriesTableColumns({
    t,
    dateFormatter,
    currentRole,
    onView: (id) => router.push(`/dashboard/service-entries/${id}`),
    onEdit: (id) => router.push(`/dashboard/service-entries/${id}/edit`),
    onDelete: (id) => setDeleteTargetId(id),
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
    pageCount: pagination?.totalPages ?? -1,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const isLoading = status === 'loading';
  const canManage = currentRole !== null && currentRole !== 'CUSTOMER';
  const deleteTarget = deleteTargetId
    ? (tableData.find((entry) => entry.id === deleteTargetId) ?? null)
    : null;

  const paginationSummary = pagination
    ? t('serviceEntries.pagination', {
        page: pagination.page,
        pages: pagination.totalPages,
        total: pagination.total,
      })
    : null;

  const isInitialLoading = !initialized || (status === 'loading' && !entities.length && !error);

  if (isInitialLoading) {
    return <ServiceEntriesTableSkeleton />;
  }

  return (
    <ServiceEntriesDataTable
      table={table}
      isLoading={isLoading}
      error={error}
      onCreateClick={() => router.push('/dashboard/service-entries/new')}
      canManage={Boolean(canManage)}
      title={t('serviceEntries.title')}
      createLabel={
        canManage ? t('serviceEntries.actions.create') : t('serviceEntries.actions.createDisabled')
      }
      createAriaLabel={t('serviceEntries.actions.openCreate')}
      paginationSummary={paginationSummary}
      searchPlaceholder={t('serviceEntries.actions.searchPlaceholder') ?? 'Buscar servicios'}
      columnLabel={t('serviceEntries.actions.manageColumns') ?? 'Columnas'}
      deleteDialog={{
        open: Boolean(deleteTarget),
        entry: deleteTarget,
        isLoading: deleteState.status === 'loading',
        onOpenChange: (open) => {
          if (!open) {
            setDeleteTargetId(null);
          }
        },
        onConfirm: () => {
          if (deleteTargetId) {
            void dispatch(deleteServiceEntry({ id: deleteTargetId }));
          }
        },
        labels: {
          title: t('serviceEntries.delete.title'),
          description: t('serviceEntries.delete.description', {
            name: deleteTarget?.companyName ?? '—',
          }),
          warning: t('serviceEntries.delete.warning'),
          cancel: t('serviceEntries.delete.cancel'),
          confirm: t('serviceEntries.delete.confirm'),
        },
      }}
      tableLabels={{
        noData: t('serviceEntries.empty'),
        pagination: {
          previous: t('serviceEntries.actions.previous') ?? 'Anterior',
          next: t('serviceEntries.actions.next') ?? 'Siguiente',
        },
      }}
    />
  );
}

function parseSortingFromParams(params: URLSearchParams) {
  const sorts = new Map<
    number,
    {
      id?: string;
      desc?: boolean;
    }
  >();
  params.forEach((value, key) => {
    const match = key.match(/^sort\[(\d+)\]\[(field|direction)\]$/);
    if (!match) {
      return;
    }
    const index = Number(match[1]);
    const prop = match[2];
    const existing = sorts.get(index) ?? {};
    if (prop === 'field') {
      existing.id = value;
    } else if (prop === 'direction') {
      existing.desc = value.toLowerCase() === 'desc';
    }
    sorts.set(index, existing);
  });

  return Array.from(sorts.values())
    .map((sort) => {
      if (!sort.id) {
        return null;
      }
      return { id: sort.id, desc: Boolean(sort.desc) };
    })
    .filter(Boolean) as { id: string; desc: boolean }[];
}

function ServiceEntriesTableSkeleton() {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '24px',
        border: '1px solid var(--surface-border)',
        bgcolor: 'var(--surface-bg)',
        color: 'var(--foreground)',
        boxShadow: 'var(--surface-shadow)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '60vh',
      }}
      className="animate-in fade-in-0 duration-200"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48 rounded-lg" />
          <Skeleton className="h-3 w-32 rounded-lg" />
        </div>
        <Skeleton className="h-9 w-36 rounded-full" />
      </div>
      <div className="flex flex-col gap-3 border-b border-border/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full max-w-md rounded-xl" />
        <Skeleton className="h-9 w-40 rounded-full" />
      </div>
      <div className="flex-1 space-y-3 p-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full rounded-xl" />
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-border/60 px-4 py-3">
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
    </Paper>
  );
}
