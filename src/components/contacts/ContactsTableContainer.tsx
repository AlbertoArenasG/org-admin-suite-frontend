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
import { ContactsDataTable } from '@/components/contacts/ContactsDataTable';
import { useContactsTableColumns } from '@/components/contacts/useContactsTableColumns';
import { useContactsTableData } from '@/components/contacts/useContactsTableData';
import { useContactsTableStore } from '@/components/contacts/useContactsTableStore';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAuthorization } from '@/features/auth';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { deleteContact, fetchContacts } from '@/features/contacts/contactsThunks';
import { resetContactsMutations } from '@/features/contacts/contactsSlice';
import {
  buildContactsQuery,
  mapContactSortingToApi,
  parseContactSortingFromParams,
} from '@/utils/contactsQuery';

function getInitialPagination(params: URLSearchParams) {
  const initialPage = Number(params.get('page'));
  const initialLimit = Number(params.get('limit'));
  return {
    pageIndex: Number.isFinite(initialPage) && initialPage > 0 ? initialPage - 1 : 0,
    pageSize: Number.isFinite(initialLimit) && initialLimit > 0 ? initialLimit : 10,
  };
}

export function ContactsTableContainer() {
  const { t, hydrated, i18n } = useTranslationHydrated('contacts');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const { showSnackbar } = useSnackbar();
  const { hasPermission } = useAuthorization();

  const listState = useAppSelector((state) => state.contacts.list);
  const mutationsState = useAppSelector((state) => state.contacts.mutations);

  const paginationState = useContactsTableStore((state) => state.pagination);
  const sorting = useContactsTableStore((state) => state.sorting);
  const columnVisibility = useContactsTableStore((state) => state.columnVisibility);
  const globalFilter = useContactsTableStore((state) => state.globalFilter);
  const debouncedFilter = useContactsTableStore((state) => state.debouncedFilter);
  const filters = useContactsTableStore((state) => state.filters);
  const deleteTarget = useContactsTableStore((state) => state.deleteTarget);
  const initialized = useContactsTableStore((state) => state.initialized);

  const setPaginationState = useContactsTableStore((state) => state.setPagination);
  const setSorting = useContactsTableStore((state) => state.setSorting);
  const setColumnVisibility = useContactsTableStore((state) => state.setColumnVisibility);
  const setGlobalFilter = useContactsTableStore((state) => state.setGlobalFilter);
  const setDebouncedFilter = useContactsTableStore((state) => state.setDebouncedFilter);
  const setDeleteTarget = useContactsTableStore((state) => state.setDeleteTarget);
  const syncFromUrl = useContactsTableStore((state) => state.syncFromUrl);
  const resetTableStore = useContactsTableStore((state) => state.reset);

  const canRead = hasPermission('CONTACTS', 'READ');
  const canCreate = hasPermission('CONTACTS', 'CREATE');
  const canUpdate = hasPermission('CONTACTS', 'UPDATE');
  const canDelete = hasPermission('CONTACTS', 'DELETE');

  useEffect(() => () => resetTableStore(), [resetTableStore]);

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    const nextPagination = getInitialPagination(params);
    const nextFilter = params.get('search') ?? '';
    const nextSorting = parseContactSortingFromParams(params);
    const nextStatus = params.get('status');
    const nextIsInternalStaff = params.get('is_internal_staff');

    syncFromUrl({
      pagination: nextPagination,
      sorting: nextSorting.length ? nextSorting : [{ id: 'createdAt', desc: true }],
      globalFilter: nextFilter,
      debouncedFilter: nextFilter.trim(),
      filters: {
        status: nextStatus === 'ACTIVE' || nextStatus === 'DELETED' ? nextStatus : null,
        isInternalStaff:
          nextIsInternalStaff === 'true' ? true : nextIsInternalStaff === 'false' ? false : null,
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
    if (!initialized || !canRead) {
      return;
    }

    void dispatch(
      fetchContacts({
        page: paginationState.pageIndex + 1,
        limit: paginationState.pageSize,
        itemsPerPage: paginationState.pageSize,
        search: debouncedFilter,
        filters,
        sorts: mapContactSortingToApi(sorting),
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
    const nextParams = buildContactsQuery({
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
    if (mutationsState.deleteStatus === 'succeeded' && mutationsState.currentContactId) {
      showSnackbar({
        message:
          mutationsState.message ??
          t('delete.success', { defaultValue: 'Contacto eliminado correctamente.' }),
        severity: 'success',
      });
      setDeleteTarget(null);
      dispatch(resetContactsMutations());
      void dispatch(
        fetchContacts({
          page: paginationState.pageIndex + 1,
          limit: paginationState.pageSize,
          itemsPerPage: paginationState.pageSize,
          search: debouncedFilter,
          filters,
          sorts: mapContactSortingToApi(sorting),
        })
      );
      return;
    }

    if (mutationsState.deleteStatus === 'failed') {
      showSnackbar({
        message:
          mutationsState.error ??
          t('delete.error', { defaultValue: 'No fue posible eliminar el contacto.' }),
        severity: 'error',
      });
      dispatch(resetContactsMutations());
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

  const tableData = useContactsTableData(listState.items);
  const columns = useContactsTableColumns({
    t,
    dateFormatter,
    canUpdate,
    canDelete,
    onDelete: (contact) => setDeleteTarget(contact),
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
    <ContactsDataTable
      table={table}
      isLoading={listState.status === 'loading'}
      error={canRead ? listState.error : t('permissions.readRestricted')}
      onCreateClick={() => router.push('/dashboard/contacts/new')}
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
      staffFilter={{
        value: filters.isInternalStaff,
        options: [
          { value: '', label: t('filters.allStaff') },
          { value: 'true', label: t('filters.internalStaff') },
          { value: 'false', label: t('filters.externalStaff') },
        ],
        onChange: (nextIsInternalStaff) => {
          const nextParams = new URLSearchParams(searchParamsString);
          if (nextIsInternalStaff === null) {
            nextParams.delete('is_internal_staff');
          } else {
            nextParams.set('is_internal_staff', String(nextIsInternalStaff));
          }
          nextParams.set('page', '1');
          router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
        },
      }}
      deleteDialog={{
        open: Boolean(deleteTarget),
        contact: deleteTarget,
        onOpenChange: (open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        },
        onConfirm: () => {
          if (!deleteTarget) {
            return;
          }
          void dispatch(deleteContact({ contactId: deleteTarget.contactId }));
        },
        isLoading: mutationsState.deleteStatus === 'loading',
        labels: {
          title: t('confirmDelete.title'),
          description: t('confirmDelete.description', {
            name: deleteTarget?.fullName ?? '—',
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
