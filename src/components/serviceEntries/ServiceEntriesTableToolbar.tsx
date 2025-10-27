'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SlidersHorizontal } from 'lucide-react';
import type { Table } from '@tanstack/react-table';
import type { ServiceEntriesTableRow } from '@/components/serviceEntries/useServiceEntriesTableData';
import { useServiceEntriesTableStore } from '@/components/serviceEntries/useServiceEntriesTableStore';

interface ServiceEntriesTableToolbarProps {
  table: Table<ServiceEntriesTableRow>;
  searchPlaceholder: string;
  columnLabel: string;
}

export function ServiceEntriesTableToolbar({
  table,
  searchPlaceholder,
  columnLabel,
}: ServiceEntriesTableToolbarProps) {
  const globalFilter = useServiceEntriesTableStore((state) => state.globalFilter);
  const setGlobalFilter = useServiceEntriesTableStore((state) => state.setGlobalFilter);

  return (
    <div className="flex flex-col gap-3 border-b border-border/60 px-4 pb-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
      <Input
        value={globalFilter}
        onChange={(event) => setGlobalFilter(event.target.value)}
        placeholder={searchPlaceholder}
        className="max-w-md"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
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
                {(column.columnDef.meta as { label?: string } | undefined)?.label ??
                  (column.columnDef.header as string) ??
                  column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
