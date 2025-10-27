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
import { UsersDataTable } from '@/components/users2/UsersDataTable';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchUsers, deleteUser } from '@/features/users/usersThunks';
import { parseUserRole } from '@/features/users/roles';
import { buildUserQuery, mapSortingToApi, parseSortingFromParams } from '@/utils/usersQuery';
import { useUsersTableColumns } from '@/components/users2/useUsersTableColumns';
import { useUsersTableData } from '@/components/users2/useUsersTableData';
import { useUsersTableStore } from '@/components/users2/useUsersTableStore';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { resetDeleteState } from '@/features/users/usersSlice';

function getInitialPagination(params: URLSearchParams) {
  const initialPage = Number(params.get('page'));
  const initialLimit = Number(params.get('limit'));
  return {
    pageIndex: Number.isFinite(initialPage) && initialPage > 0 ? initialPage - 1 : 0,
    pageSize: Number.isFinite(initialLimit) && initialLimit > 0 ? initialLimit : 10,
  };
}

export function UsersTableContainer() {
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
  } = useAppSelector((state) => state.users);
  const authUser = useAppSelector((state) => state.auth.user);

  const paginationState = useUsersTableStore((state) => state.pagination);
  const sorting = useUsersTableStore((state) => state.sorting);
  const columnVisibility = useUsersTableStore((state) => state.columnVisibility);
  const globalFilter = useUsersTableStore((state) => state.globalFilter);
  const debouncedFilter = useUsersTableStore((state) => state.debouncedFilter);
  const deleteTarget = useUsersTableStore((state) => state.deleteTarget);
  const initialized = useUsersTableStore((state) => state.initialized);

  const setPaginationState = useUsersTableStore((state) => state.setPagination);
  const setSorting = useUsersTableStore((state) => state.setSorting);
  const setColumnVisibility = useUsersTableStore((state) => state.setColumnVisibility);
  const setGlobalFilter = useUsersTableStore((state) => state.setGlobalFilter);
  const setDebouncedFilter = useUsersTableStore((state) => state.setDebouncedFilter);
  const setDeleteTarget = useUsersTableStore((state) => state.setDeleteTarget);
  const syncFromUrl = useUsersTableStore((state) => state.syncFromUrl);
  const resetTableStore = useUsersTableStore((state) => state.reset);
  const { showSnackbar } = useSnackbar();

  useEffect(() => () => resetTableStore(), [resetTableStore]);

  useEffect(() => {
    if (deleteState.status === 'succeeded' && deleteState.targetId) {
      showSnackbar({
        message:
          deleteState.message ??
          t('users.delete.success', { defaultValue: 'Usuario eliminado correctamente.' }),
        severity: 'success',
      });
      setDeleteTarget(null);
      dispatch(resetDeleteState());
      void dispatch(
        fetchUsers({
          page: paginationState.pageIndex + 1,
          limit: paginationState.pageSize,
          itemsPerPage: paginationState.pageSize,
          search: debouncedFilter,
          sorts: mapSortingToApi(sorting),
        })
      );
    } else if (deleteState.status === 'failed') {
      showSnackbar({
        message:
          deleteState.error ??
          t('users.delete.error', { defaultValue: 'No fue posible eliminar al usuario.' }),
        severity: 'error',
      });
      dispatch(resetDeleteState());
    }
  }, [
    debouncedFilter,
    deleteState,
    dispatch,
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

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedFilter(globalFilter.trim());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [globalFilter, setDebouncedFilter]);

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    const nextPagination = getInitialPagination(params);
    const nextFilter = params.get('search') ?? '';
    const nextSorting = parseSortingFromParams(params);

    syncFromUrl({
      pagination: nextPagination,
      sorting: nextSorting,
      globalFilter: nextFilter,
      debouncedFilter: nextFilter.trim(),
    });
  }, [searchParamsString, syncFromUrl]);

  useEffect(() => {
    if (!initialized) {
      return;
    }

    void dispatch(
      fetchUsers({
        page: paginationState.pageIndex + 1,
        limit: paginationState.pageSize,
        itemsPerPage: paginationState.pageSize,
        search: debouncedFilter,
        sorts: mapSortingToApi(sorting),
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
    if (!initialized) {
      return;
    }

    const baseParams = new URLSearchParams(searchParamsString);
    const nextParams = buildUserQuery({
      pageIndex: paginationState.pageIndex,
      pageSize: paginationState.pageSize,
      search: globalFilter,
      sorting,
      baseParams,
    });

    const nextQuery = nextParams.toString();
    if (nextQuery === searchParamsString) {
      return;
    }

    router.replace(`${pathname}?${nextQuery}`, { scroll: false });
  }, [
    globalFilter,
    paginationState.pageIndex,
    paginationState.pageSize,
    pathname,
    router,
    searchParamsString,
    sorting,
    initialized,
  ]);

  useEffect(() => {
    if (!pagination || !initialized) {
      return;
    }

    const totalPages = Math.max(1, pagination.totalPages);
    const maxPageIndex = Math.max(0, totalPages - 1);
    const serverPageSize = pagination.perPage;

    setPaginationState((current) => {
      const nextPageIndex = current.pageIndex > maxPageIndex ? maxPageIndex : current.pageIndex;
      const nextPageSize = serverPageSize > 0 ? serverPageSize : current.pageSize;

      if (nextPageIndex === current.pageIndex && nextPageSize === current.pageSize) {
        return current;
      }

      return { pageIndex: nextPageIndex, pageSize: nextPageSize };
    });
  }, [initialized, pagination, setPaginationState]);

  const tableData = useUsersTableData(entities);

  const currentRole = authUser ? parseUserRole(authUser.role) : null;

  const columns = useUsersTableColumns({
    t,
    dateFormatter,
    currentRole,
    currentUserId: authUser?.id ?? null,
    onDelete: (user) => setDeleteTarget(user),
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

  const paginationSummary = pagination
    ? t('users.pagination', {
        page: pagination.page,
        pages: pagination.totalPages,
        total: pagination.total,
      })
    : null;

  return (
    <UsersDataTable
      table={table}
      isLoading={isLoading}
      error={error}
      onInviteClick={() => router.push('/dashboard/users/invite')}
      title={t('users.title')}
      inviteLabel={t('users.actions.inviteShort')}
      inviteAriaLabel={t('users.actions.openInvite')}
      paginationSummary={paginationSummary}
      searchPlaceholder={t('users.actions.searchPlaceholder') ?? 'Buscar usuarios'}
      columnLabel={t('users.actions.manageColumns') ?? 'Columnas'}
      deleteDialog={{
        open: Boolean(deleteTarget),
        user: deleteTarget,
        onOpenChange: (open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        },
        onConfirm: () => {
          if (!deleteTarget) {
            return;
          }
          void dispatch(deleteUser({ id: deleteTarget.id }));
        },
        isLoading: deleteState.status === 'loading',
        labels: {
          title: t('users.confirmDelete.title'),
          description: t('users.confirmDelete.description', {
            name: deleteTarget?.fullName ?? deleteTarget?.email ?? '—',
          }),
          warning: t('users.confirmDelete.warning') ?? 'Esta acción no se puede deshacer.',
          cancel: t('users.confirmDelete.cancel'),
          confirm: t('users.confirmDelete.confirm'),
        },
      }}
      tableLabels={{
        noData: t('users.empty'),
        pagination: {
          previous: t('users.actions.previous') ?? 'Anterior',
          next: t('users.actions.next') ?? 'Siguiente',
        },
      }}
    />
  );
}
