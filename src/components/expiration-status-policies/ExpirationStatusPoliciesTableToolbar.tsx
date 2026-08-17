'use client';

import type { Table } from '@tanstack/react-table';
import { SlidersHorizontal } from 'lucide-react';

import type { ExpirationStatusPoliciesTableRow } from '@/components/expiration-status-policies/types';
import { useExpirationStatusPoliciesTableStore } from '@/components/expiration-status-policies/useExpirationStatusPoliciesTableStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import type { ExpirationStatusPolicyStatusCatalogItem } from '@/features/expiration-status-policies/types';

interface ExpirationStatusPoliciesTableToolbarProps {
  table: Table<ExpirationStatusPoliciesTableRow>;
  searchPlaceholder: string;
  columnLabel: string;
  statusPlaceholder: string;
  statuses: ExpirationStatusPolicyStatusCatalogItem[];
}

export function ExpirationStatusPoliciesTableToolbar({
  table,
  searchPlaceholder,
  columnLabel,
  statusPlaceholder,
  statuses,
}: ExpirationStatusPoliciesTableToolbarProps) {
  const globalFilter = useExpirationStatusPoliciesTableStore((state) => state.globalFilter);
  const setGlobalFilter = useExpirationStatusPoliciesTableStore((state) => state.setGlobalFilter);
  const filters = useExpirationStatusPoliciesTableStore((state) => state.filters);
  const setFilters = useExpirationStatusPoliciesTableStore((state) => state.setFilters);
  const visibleStatuses = statuses.filter((status) => status.code !== 'DELETED');

  return (
    <div className="flex flex-col gap-3 border-b border-border/60 px-4 pb-3 pt-2">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Input
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          placeholder={searchPlaceholder}
          className="max-w-md"
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="min-w-[14rem]">
            <select
              value={filters.status ?? ''}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  status: event.target.value
                    ? (event.target.value as (typeof statuses)[number]['code'])
                    : null,
                }))
              }
              className="h-9 min-w-[14rem] rounded-lg border border-border/60 bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="">{statusPlaceholder}</option>
              {visibleStatuses.map((status) => (
                <option key={status.code} value={status.code}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 self-end sm:self-auto">
                <SlidersHorizontal className="size-4" />
                {columnLabel}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{columnLabel}</DropdownMenuLabel>
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
                      const label = (column.columnDef.meta as { label?: string } | undefined)
                        ?.label;
                      if (label) {
                        return label;
                      }
                      return column.id;
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
