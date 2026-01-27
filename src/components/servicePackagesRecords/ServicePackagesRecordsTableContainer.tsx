'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
} from '@tanstack/react-table';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import {
  deleteServicePackageRecord,
  fetchServicePackagesRecords,
} from '@/features/servicePackagesRecords';
import { ServicePackagesRecordsDataTable } from '@/components/servicePackagesRecords/ServicePackagesRecordsDataTable';
import { useServicePackagesRecordsTableData } from '@/components/servicePackagesRecords/useServicePackagesRecordsTableData';
import { useServicePackagesRecordsTableColumns } from '@/components/servicePackagesRecords/useServicePackagesRecordsTableColumns';
import { useServicePackagesRecordsTableStore } from '@/components/servicePackagesRecords/useServicePackagesRecordsTableStore';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { resetServicePackageRecordDelete } from '@/features/servicePackagesRecords/servicePackagesRecordsSlice';
import type { ServicePackageRecord } from '@/features/servicePackagesRecords';

function getPaginationFromParams(params: URLSearchParams): PaginationState {
  const page = Number(params.get('page'));
  const limit = Number(params.get('limit'));
  return {
    pageIndex: Number.isFinite(page) && page > 0 ? page - 1 : 0,
    pageSize: Number.isFinite(limit) && limit > 0 ? limit : 10,
  };
}

export function ServicePackagesRecordsTableContainer() {
  const { t, hydrated, i18n } = useTranslationHydrated('servicePackagesRecords');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const { showSnackbar } = useSnackbar();

  const {
    entities,
    status,
    error,
    pagination,
    delete: deleteState,
  } = useAppSelector((state) => state.servicePackagesRecords);

  const paginationState = useServicePackagesRecordsTableStore((state) => state.pagination);
  const sorting = useServicePackagesRecordsTableStore((state) => state.sorting);
  const columnVisibility = useServicePackagesRecordsTableStore((state) => state.columnVisibility);
  const globalFilter = useServicePackagesRecordsTableStore((state) => state.globalFilter);
  const debouncedFilter = useServicePackagesRecordsTableStore((state) => state.debouncedFilter);
  const deleteTargetId = useServicePackagesRecordsTableStore((state) => state.deleteTargetId);
  const initialized = useServicePackagesRecordsTableStore((state) => state.initialized);

  const setPaginationState = useServicePackagesRecordsTableStore((state) => state.setPagination);
  const setSorting = useServicePackagesRecordsTableStore((state) => state.setSorting);
  const setColumnVisibility = useServicePackagesRecordsTableStore(
    (state) => state.setColumnVisibility
  );
  const setDebouncedFilter = useServicePackagesRecordsTableStore(
    (state) => state.setDebouncedFilter
  );
  const setDeleteTargetId = useServicePackagesRecordsTableStore((state) => state.setDeleteTargetId);
  const setInitialized = useServicePackagesRecordsTableStore((state) => state.setInitialized);
  const syncFromUrl = useServicePackagesRecordsTableStore((state) => state.syncFromUrl);
  const resetStore = useServicePackagesRecordsTableStore((state) => state.reset);

  useEffect(() => () => resetStore(), [resetStore]);

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    const paginationFromParams = getPaginationFromParams(params);
    const search = params.get('search') ?? '';
    syncFromUrl({
      pagination: paginationFromParams,
      sorting: [],
      globalFilter: search,
      debouncedFilter: search.trim(),
    });
    setInitialized(true);
  }, [searchParamsString, setInitialized, syncFromUrl]);

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
      fetchServicePackagesRecords({
        page: paginationState.pageIndex + 1,
        limit: paginationState.pageSize,
        search: debouncedFilter,
      })
    );
  }, [debouncedFilter, dispatch, initialized, paginationState.pageIndex, paginationState.pageSize]);

  useEffect(() => {
    if (!pagination || !initialized) {
      return;
    }
    const totalPages = Math.max(1, pagination.totalPages);
    const maxPageIndex = Math.max(0, totalPages - 1);
    setPaginationState((current) => {
      const nextIndex = current.pageIndex > maxPageIndex ? maxPageIndex : current.pageIndex;
      const nextSize = current.pageSize;
      if (nextIndex === current.pageIndex && nextSize === current.pageSize) {
        return current;
      }
      return { pageIndex: nextIndex, pageSize: nextSize };
    });
  }, [initialized, pagination, setPaginationState]);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    const params = new URLSearchParams();
    params.set('page', String(paginationState.pageIndex + 1));
    params.set('limit', String(paginationState.pageSize));
    if (globalFilter.trim()) {
      params.set('search', globalFilter.trim());
    }
    const next = params.toString();
    if (next === searchParamsString) {
      return;
    }
    router.replace(`${pathname}?${next}`, { scroll: false });
  }, [
    globalFilter,
    initialized,
    paginationState.pageIndex,
    paginationState.pageSize,
    pathname,
    router,
    searchParamsString,
  ]);

  useEffect(() => {
    if (deleteState.status === 'succeeded') {
      showSnackbar({
        message:
          deleteState.message ??
          t('delete.success', {
            defaultValue: 'Registro eliminado correctamente.',
          }),
        severity: 'success',
      });
      setDeleteTargetId(null);
      dispatch(resetServicePackageRecordDelete());
      void dispatch(
        fetchServicePackagesRecords({
          page: paginationState.pageIndex + 1,
          limit: paginationState.pageSize,
          search: debouncedFilter,
        })
      );
    } else if (deleteState.status === 'failed') {
      showSnackbar({
        message:
          deleteState.error ??
          t('delete.error', {
            defaultValue: 'No fue posible eliminar el registro.',
          }),
        severity: 'error',
      });
      dispatch(resetServicePackageRecordDelete());
    }
  }, [
    debouncedFilter,
    deleteState,
    dispatch,
    paginationState.pageIndex,
    paginationState.pageSize,
    setDeleteTargetId,
    showSnackbar,
    t,
  ]);

  const tableData = useServicePackagesRecordsTableData(entities);
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(hydrated ? i18n.language : 'es', {
        dateStyle: 'medium',
        timeStyle: undefined,
      }),
    [hydrated, i18n.language]
  );

  const columns = useServicePackagesRecordsTableColumns({
    t,
    dateFormatter,
    onView: (id: string) => router.push(`/dashboard/service-packages-records/${id}`),
    onDelete: (id: string) => setDeleteTargetId(id),
  });

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      pagination: paginationState,
      sorting,
      columnVisibility,
    },
    onPaginationChange: setPaginationState,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: pagination?.totalPages ?? -1,
  });

  const paginationSummary = useMemo(() => {
    if (!pagination) {
      return null;
    }
    const from = (pagination.page - 1) * pagination.perPage + 1;
    const to = Math.min(pagination.page * pagination.perPage, pagination.total);
    return t('table.summary', {
      defaultValue: 'Mostrando {{from}}-{{to}} de {{total}} registros',
      from: pagination.total ? from : 0,
      to: pagination.total ? to : 0,
      total: pagination.total,
    });
  }, [pagination, t]);

  const deleteRecordSummary: ServicePackageRecord | undefined = entities.find(
    (record) => record.id === deleteTargetId
  );

  return (
    <ServicePackagesRecordsDataTable
      table={table}
      isLoading={status === 'loading' && !entities.length}
      error={error}
      title={t('title')}
      subtitle={paginationSummary}
      searchPlaceholder={t('table.searchPlaceholder')}
      columnLabel={t('table.columnLabel')}
      tableLabels={{
        noData: t('table.noData'),
        pagination: {
          previous: t('table.pagination.previous'),
          next: t('table.pagination.next'),
        },
      }}
      deleteDialog={{
        open: Boolean(deleteTargetId),
        summary: deleteRecordSummary
          ? {
              serviceOrder: deleteRecordSummary.serviceOrder,
              company: deleteRecordSummary.company,
            }
          : null,
        onOpenChange: (open) => {
          if (!open) {
            setDeleteTargetId(null);
          }
        },
        onConfirm: () => {
          if (deleteTargetId) {
            void dispatch(deleteServicePackageRecord({ id: deleteTargetId }));
          }
        },
        isLoading: deleteState.status === 'loading',
        labels: {
          title: t('delete.title'),
          description: t('delete.description'),
          warning: t('delete.warning'),
          cancel: t('delete.cancel'),
          confirm: t('delete.confirm'),
        },
      }}
    />
  );
}
