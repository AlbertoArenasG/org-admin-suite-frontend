'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import type { PaginationState } from '@tanstack/react-table';
import Chip from '@mui/material/Chip';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { UsersDataTable } from '@/components/users2/UsersDataTable';
import { UsersTableRowActions } from '@/components/users2/UsersTableRowActions';
import type { UsersTableUser } from '@/components/users2/types';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchUsers } from '@/features/users/usersThunks';
import { parseUserRole } from '@/features/users/roles';

export function UsersTableContainer() {
  const { t, hydrated, i18n } = useTranslationHydrated('common');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { entities, status, error, pagination } = useAppSelector((state) => state.users);
  const authUser = useAppSelector((state) => state.auth.user);

  const [paginationState, setPaginationState] = useState<PaginationState>(() => {
    const initialPage = Number(searchParams.get('page'));
    const initialLimit = Number(searchParams.get('limit'));
    return {
      pageIndex: Number.isFinite(initialPage) && initialPage > 0 ? initialPage - 1 : 0,
      pageSize: Number.isFinite(initialLimit) && initialLimit > 0 ? initialLimit : 10,
    };
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<UsersTableUser | null>(null);

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
    void dispatch(
      fetchUsers({
        page: paginationState.pageIndex + 1,
        limit: paginationState.pageSize,
      })
    );
  }, [dispatch, paginationState.pageIndex, paginationState.pageSize]);

  useEffect(() => {
    const pageParam = Number(searchParams.get('page'));
    const limitParam = Number(searchParams.get('limit'));
    const nextState: PaginationState = {
      pageIndex: Number.isFinite(pageParam) && pageParam > 0 ? pageParam - 1 : 0,
      pageSize:
        Number.isFinite(limitParam) && limitParam > 0 ? limitParam : paginationState.pageSize,
    };

    if (
      nextState.pageIndex !== paginationState.pageIndex ||
      nextState.pageSize !== paginationState.pageSize
    ) {
      setPaginationState(nextState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams.toString());
    const desiredPage = paginationState.pageIndex + 1;
    const desiredLimit = paginationState.pageSize;
    const currentPage = Number(currentParams.get('page')) || 1;
    const currentLimit = Number(currentParams.get('limit')) || desiredLimit;

    if (currentPage !== desiredPage || currentLimit !== desiredLimit) {
      currentParams.set('page', String(desiredPage));
      currentParams.set('limit', String(desiredLimit));
      router.replace(`${pathname}?${currentParams.toString()}`, { scroll: false });
    }
  }, [paginationState.pageIndex, paginationState.pageSize, pathname, router, searchParams]);

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

  const tableData = useMemo<UsersTableUser[]>(
    () =>
      entities.map((user) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        roleName: user.roleName,
        roleId: parseUserRole(user.role),
        status: user.status,
        statusName: user.statusName,
        createdAt: user.createdAt,
      })),
    [entities]
  );

  const columns = useMemo<ColumnDef<UsersTableUser>[]>(
    () => [
      {
        accessorKey: 'fullName',
        header: t('users.table.columns.fullName'),
        cell: ({ getValue }) => (
          <span className="font-medium text-foreground">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'email',
        header: t('users.table.columns.email'),
        cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>,
      },
      {
        accessorKey: 'roleName',
        header: t('users.table.columns.role'),
      },
      {
        accessorKey: 'statusName',
        header: t('users.table.columns.status'),
        cell: ({ row }) => {
          const normalized = (row.original.status ?? '').toLowerCase();
          const color =
            normalized === 'active' ? 'success' : normalized === 'inactive' ? 'default' : 'warning';
          return (
            <Chip color={color} variant="outlined" size="small" label={row.original.statusName} />
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: t('users.table.columns.createdAt'),
        cell: ({ getValue }) => {
          const raw = getValue<string>();
          const date = new Date(raw);
          if (Number.isNaN(date.getTime())) {
            return raw;
          }
          return dateFormatter.format(date);
        },
      },
      {
        id: 'actions',
        enableHiding: false,
        header: () => <span className="sr-only">{t('users.actions.openMenu')}</span>,
        cell: ({ row }) => (
          <UsersTableRowActions
            user={row.original}
            currentRole={authUser?.role ?? null}
            currentUserId={authUser?.id ?? null}
            onDelete={(user) => setDeleteTarget(user)}
            labels={{
              menu: t('users.actions.openMenu'),
              view: t('users.actions.view') ?? 'Ver',
              edit: t('users.actions.edit'),
              invite: t('users.actions.invite'),
              delete: t('users.actions.delete'),
            }}
          />
        ),
      },
    ],
    [authUser?.id, authUser?.role, dateFormatter, t]
  );

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
