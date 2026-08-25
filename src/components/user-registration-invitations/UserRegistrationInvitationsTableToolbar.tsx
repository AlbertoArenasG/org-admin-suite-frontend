'use client';

import { SlidersHorizontal, X } from 'lucide-react';
import type { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import type { UserRegistrationInvitationStatus } from '@/features/user-registration-invitations';
import { useUserRegistrationInvitationsTableStore } from './useUserRegistrationInvitationsTableStore';
import type { UserRegistrationInvitationsTableRow } from './types';

interface UserRegistrationInvitationsTableToolbarProps {
  table: Table<UserRegistrationInvitationsTableRow>;
  labels: {
    searchPlaceholder: string;
    statusPlaceholder: string;
    statuses: Record<UserRegistrationInvitationStatus, string>;
    clearFilters: string;
    columnLabel: string;
  };
}

export function UserRegistrationInvitationsTableToolbar({
  table,
  labels,
}: UserRegistrationInvitationsTableToolbarProps) {
  const globalFilter = useUserRegistrationInvitationsTableStore((state) => state.globalFilter);
  const filters = useUserRegistrationInvitationsTableStore((state) => state.filters);
  const setGlobalFilter = useUserRegistrationInvitationsTableStore(
    (state) => state.setGlobalFilter
  );
  const setFilters = useUserRegistrationInvitationsTableStore((state) => state.setFilters);
  const setPagination = useUserRegistrationInvitationsTableStore((state) => state.setPagination);
  const hasFilters = Boolean(globalFilter.trim() || filters.status);

  const clearFilters = () => {
    setGlobalFilter('');
    setFilters({ status: null });
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  return (
    <div className="flex flex-col gap-3 border-b border-border/60 px-4 pb-3 pt-2">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <Input
          value={globalFilter}
          onChange={(event) => {
            setGlobalFilter(event.target.value);
            setPagination((current) => ({ ...current, pageIndex: 0 }));
          }}
          placeholder={labels.searchPlaceholder}
          className="max-w-md"
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={filters.status ?? ''}
            onChange={(event) => {
              const value = event.target.value as UserRegistrationInvitationStatus | '';
              setFilters({ status: value || null });
              setPagination((current) => ({ ...current, pageIndex: 0 }));
            }}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">{labels.statusPlaceholder}</option>
            {(Object.keys(labels.statuses) as UserRegistrationInvitationStatus[]).map((status) => (
              <option key={status} value={status}>
                {labels.statuses[status]}
              </option>
            ))}
          </select>
          {hasFilters ? (
            <Button variant="ghost" size="sm" className="gap-2" onClick={clearFilters}>
              <X className="size-4" />
              {labels.clearFilters}
            </Button>
          ) : null}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="size-4" />
                {labels.columnLabel}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>{labels.columnLabel}</DropdownMenuLabel>
              {table
                .getAllLeafColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
                  >
                    {(() => {
                      const header = column.columnDef.header;
                      if (typeof header === 'string') {
                        return header;
                      }
                      return (
                        (column.columnDef.meta as { label?: string } | undefined)?.label ??
                        column.id
                      );
                    })()}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
