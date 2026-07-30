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
import { RolesDataTable } from '@/components/roles/RolesDataTable';
import { useRolesTableColumns } from '@/components/roles/useRolesTableColumns';
import { useRolesTableData } from '@/components/roles/useRolesTableData';
import { useRolesTableStore } from '@/components/roles/useRolesTableStore';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAuthorization } from '@/features/auth';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { fetchRoles, deleteRole } from '@/features/roles/rolesThunks';
import { resetRoleMutations } from '@/features/roles';
import {
  buildRolesQuery,
  mapRoleSortingToApi,
  parseRoleSortingFromParams,
} from '@/utils/rolesQuery';

function getInitialPagination(params: URLSearchParams) {
  const initialPage = Number(params.get('page'));
  const initialLimit = Number(params.get('limit'));
  return {
    pageIndex: Number.isFinite(initialPage) && initialPage > 0 ? initialPage - 1 : 0,
    pageSize: Number.isFinite(initialLimit) && initialLimit > 0 ? initialLimit : 10,
  };
}

export function RolesTableContainer() {
  const { t, hydrated, i18n } = useTranslationHydrated('roles');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const { showSnackbar } = useSnackbar();
  const { hasPermission } = useAuthorization();

  const listState = useAppSelector((state) => state.roles.list);
  const mutationsState = useAppSelector((state) => state.roles.mutations);

  const paginationState = useRolesTableStore((state) => state.pagination);
  const sorting = useRolesTableStore((state) => state.sorting);
  const columnVisibility = useRolesTableStore((state) => state.columnVisibility);
  const globalFilter = useRolesTableStore((state) => state.globalFilter);
  const debouncedFilter = useRolesTableStore((state) => state.debouncedFilter);
  const deleteTarget = useRolesTableStore((state) => state.deleteTarget);
  const initialized = useRolesTableStore((state) => state.initialized);

  const setPaginationState = useRolesTableStore((state) => state.setPagination);
  const setSorting = useRolesTableStore((state) => state.setSorting);
  const setColumnVisibility = useRolesTableStore((state) => state.setColumnVisibility);
  const setGlobalFilter = useRolesTableStore((state) => state.setGlobalFilter);
  const setDebouncedFilter = useRolesTableStore((state) => state.setDebouncedFilter);
  const setDeleteTarget = useRolesTableStore((state) => state.setDeleteTarget);
  const syncFromUrl = useRolesTableStore((state) => state.syncFromUrl);
  const resetTableStore = useRolesTableStore((state) => state.reset);

  const canRead = hasPermission('ROLES', 'READ');
  const canCreate = hasPermission('ROLES', 'CREATE');
  const canUpdate = hasPermission('ROLES', 'UPDATE');
  const canDelete = hasPermission('ROLES', 'DELETE');

  useEffect(() => () => resetTableStore(), [resetTableStore]);

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    const nextPagination = getInitialPagination(params);
    const nextFilter = params.get('search') ?? '';
    const nextSorting = parseRoleSortingFromParams(params);

    syncFromUrl({
      pagination: nextPagination,
      sorting: nextSorting.length ? nextSorting : [{ id: 'createdAt', desc: true }],
      globalFilter: nextFilter,
      debouncedFilter: nextFilter.trim(),
    });
  }, [searchParamsString, syncFromUrl]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedFilter(globalFilter.trim());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [globalFilter, setDebouncedFilter]);

  useEffect(() => {
    if (!initialized || !canRead) {
      return;
    }

    void dispatch(
      fetchRoles({
        page: paginationState.pageIndex + 1,
        limit: paginationState.pageSize,
        search: debouncedFilter,
        sorts: mapRoleSortingToApi(sorting),
      })
    );
  }, [
    canRead,
    debouncedFilter,
    dispatch,
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
    const nextParams = buildRolesQuery({
      pageIndex: paginationState.pageIndex,
      pageSize: paginationState.pageSize,
      search: globalFilter,
      sorting,
      baseParams,
    });

    if (nextParams.toString() === searchParamsString) {
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
    if (mutationsState.deleteStatus === 'succeeded' && mutationsState.currentRoleId) {
      showSnackbar({
        message:
          mutationsState.message ??
          t('delete.success', { defaultValue: 'Rol eliminado correctamente.' }),
        severity: 'success',
      });
      setDeleteTarget(null);
      dispatch(resetRoleMutations());
      void dispatch(
        fetchRoles({
          page: paginationState.pageIndex + 1,
          limit: paginationState.pageSize,
          search: debouncedFilter,
          sorts: mapRoleSortingToApi(sorting),
        })
      );
      return;
    }

    if (mutationsState.deleteStatus === 'failed') {
      showSnackbar({
        message:
          mutationsState.error ??
          t('delete.error', { defaultValue: 'No fue posible eliminar el rol.' }),
        severity: 'error',
      });
      dispatch(resetRoleMutations());
    }
  }, [
    debouncedFilter,
    dispatch,
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

  const tableData = useRolesTableData(listState.items, t);
  const columns = useRolesTableColumns({
    t,
    dateFormatter,
    canUpdate,
    canDelete,
    onDelete: (role) => setDeleteTarget(role),
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
    pageCount: listState.totalPages || -1,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (!canRead) {
    return (
      <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        {t('restricted', {
          defaultValue: 'No cuentas con permiso ROLES/READ para consultar este módulo.',
        })}
      </div>
    );
  }

  const paginationSummary =
    listState.total || listState.page
      ? t('pagination', {
          page: listState.page,
          pages: Math.max(listState.totalPages, 1),
          total: listState.total,
        })
      : null;

  return (
    <RolesDataTable
      table={table}
      isLoading={listState.status === 'loading'}
      error={listState.error}
      onCreateClick={() => router.push('/dashboard/roles/new')}
      canCreate={canCreate}
      title={t('title')}
      createLabel={canCreate ? t('actions.create') : t('actions.createDisabled')}
      createAriaLabel={t('actions.openCreate')}
      paginationSummary={paginationSummary}
      searchPlaceholder={t('actions.searchPlaceholder')}
      columnLabel={t('actions.manageColumns')}
      deleteDialog={{
        open: Boolean(deleteTarget),
        role: deleteTarget,
        isLoading: mutationsState.deleteStatus === 'loading',
        onOpenChange: (open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        },
        onConfirm: () => {
          if (!deleteTarget) {
            return;
          }
          void dispatch(deleteRole({ roleId: deleteTarget.roleId }));
        },
        labels: {
          title: t('delete.title'),
          description: t('delete.description'),
          warning: t('delete.warning'),
          cancel: t('delete.cancel'),
          confirm: t('delete.confirm'),
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
