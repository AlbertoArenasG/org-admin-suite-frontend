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
import type { ContactsTableRow } from '@/components/contacts/types';
import { useContactsTableStore } from '@/components/contacts/useContactsTableStore';

interface ContactsTableToolbarProps {
  table: Table<ContactsTableRow>;
  searchPlaceholder: string;
  columnLabel: string;
  isInternalStaff: boolean | null;
  staffOptions: Array<{ value: '' | 'true' | 'false'; label: string }>;
  onInternalStaffChange: (value: boolean | null) => void;
}

export function ContactsTableToolbar({
  table,
  searchPlaceholder,
  columnLabel,
  isInternalStaff,
  staffOptions,
  onInternalStaffChange,
}: ContactsTableToolbarProps) {
  const globalFilter = useContactsTableStore((state) => state.globalFilter);
  const setGlobalFilter = useContactsTableStore((state) => state.setGlobalFilter);

  return (
    <div className="flex flex-col gap-3 border-b border-border/60 px-4 pb-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          placeholder={searchPlaceholder}
          className="max-w-md"
        />
        <select
          value={isInternalStaff === null ? '' : String(isInternalStaff)}
          onChange={(event) => {
            const value = event.target.value;
            onInternalStaffChange(value === '' ? null : value === 'true');
          }}
          className="border-input focus-visible:ring-ring/50 h-10 w-full rounded-md border bg-background px-3 text-sm shadow-xs focus-visible:outline-none sm:max-w-xs"
        >
          {staffOptions.map((option) => (
            <option key={option.value || 'all'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
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
                {(() => {
                  const header = column.columnDef.header;
                  if (typeof header === 'string') {
                    return header;
                  }
                  const label = (column.columnDef.meta as { label?: string } | undefined)?.label;
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
  );
}
