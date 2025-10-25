'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { UsersDataTable } from '@/components/users2/UsersDataTable';
import type { UsersTableUser } from '@/components/users2/types';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchUsers } from '@/features/users/usersThunks';
import { parseUserRole } from '@/features/users/roles';
import {
  areSortingEqual,
  buildUserQuery,
  mapSortingToApi,
  parseSortingFromParams,
} from '@/utils/usersQuery';
import { useUsersTableColumns } from '@/components/users2/useUsersTableColumns';
import { useUsersTableData } from '@/components/users2/useUsersTableData';

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

  const { entities, status, error, pagination } = useAppSelector((state) => state.users);
  const authUser = useAppSelector((state) => state.auth.user);

  const [paginationState, setPaginationState] = useState<PaginationState>(() =>
    getInitialPagination(new URLSearchParams(searchParamsString))
  );
  const [sorting, setSorting] = useState<SortingState>(() =>
    parseSortingFromParams(new URLSearchParams(searchParamsString))
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState(
    new URLSearchParams(searchParamsString).get('search') ?? ''
  );
  const [debouncedFilter, setDebouncedFilter] = useState(globalFilter);
  const [deleteTarget, setDeleteTarget] = useState<UsersTableUser | null>(null);
  const lastSyncedQueryRef = useRef(searchParamsString);

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
  }, [globalFilter]);

  useEffect(() => {
    void dispatch(
      fetchUsers({
        page: paginationState.pageIndex + 1,
        limit: paginationState.pageSize,
        itemsPerPage: paginationState.pageSize,
        search: debouncedFilter,
        sorts: mapSortingToApi(sorting),
      })
    );
  }, [debouncedFilter, dispatch, paginationState.pageIndex, paginationState.pageSize, sorting]);

  useEffect(() => {
    const currentQuery = searchParamsString;
    if (currentQuery === lastSyncedQueryRef.current) {
      return;
    }
    lastSyncedQueryRef.current = currentQuery;

    const params = new URLSearchParams(currentQuery);
    const nextPagination = getInitialPagination(params);
    setPaginationState((current) => {
      if (
        current.pageIndex === nextPagination.pageIndex &&
        current.pageSize === nextPagination.pageSize
      ) {
        return current;
      }
      return nextPagination;
    });

    const nextFilter = params.get('search') ?? '';
    setGlobalFilter((current) => (current === nextFilter ? current : nextFilter));

    const nextSorting = parseSortingFromParams(params);
    setSorting((current) => (areSortingEqual(current, nextSorting) ? current : nextSorting));
  }, [searchParamsString]);

  useEffect(() => {
    const nextParams = buildUserQuery({
      pageIndex: paginationState.pageIndex,
      pageSize: paginationState.pageSize,
      search: globalFilter,
      sorting,
      baseParams: new URLSearchParams(searchParamsString),
    });

    const nextQuery = nextParams.toString();
    if (nextQuery !== lastSyncedQueryRef.current) {
      lastSyncedQueryRef.current = nextQuery;
      router.replace(`${pathname}?${nextQuery}`, { scroll: false });
    }
  }, [
    globalFilter,
    paginationState.pageIndex,
    paginationState.pageSize,
    pathname,
    router,
    searchParamsString,
    sorting,
  ]);

  useEffect(() => {
    if (!pagination) {
      return;
    }

    setPaginationState((current) => {
      const newPageIndex = Math.max(0, Math.min(pagination.page - 1, pagination.totalPages - 1));
      const newPageSize = pagination.perPage;
      if (current.pageIndex === newPageIndex && current.pageSize === newPageSize) {
        return current;
      }
      return { pageIndex: newPageIndex, pageSize: newPageSize };
    });
  }, [pagination]);

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
          if (deleteTarget) {
            console.log('Delete user payload', deleteTarget.id);
          }
          setDeleteTarget(null);
        },
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
      toolbarState={{
        globalFilter,
        onGlobalFilterChange: setGlobalFilter,
      }}
    />
  );
}
