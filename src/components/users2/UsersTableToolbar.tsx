'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SlidersHorizontal } from 'lucide-react';
import type { Table } from '@tanstack/react-table';
import type { UsersTableUser } from '@/components/users2/types';
import { useUsersTableStore } from '@/components/users2/useUsersTableStore';
import type { CustomerOption } from '@/features/customers';

interface UsersTableToolbarProps {
  table: Table<UsersTableUser>;
  searchPlaceholder: string;
  columnLabel: string;
  customerOptions: CustomerOption[];
  customerId: string | null;
  customerPlaceholder: string;
  customersLoading: boolean;
  onCustomerChange: (customerId: string | null) => void;
  isInternalStaff: boolean | null;
  staffOptions: Array<{ value: '' | 'true' | 'false'; label: string }>;
  onInternalStaffChange: (value: boolean | null) => void;
}

export function UsersTableToolbar({
  table,
  searchPlaceholder,
  columnLabel,
  customerOptions,
  customerId,
  customerPlaceholder,
  customersLoading,
  onCustomerChange,
  isInternalStaff,
  staffOptions,
  onInternalStaffChange,
}: UsersTableToolbarProps) {
  const globalFilter = useUsersTableStore((state) => state.globalFilter);
  const setGlobalFilter = useUsersTableStore((state) => state.setGlobalFilter);

  return (
    <div className="flex flex-col gap-3 border-b border-border/60 px-4 pb-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          placeholder={searchPlaceholder}
          className="max-w-md"
        />
        <div className="w-full sm:max-w-xs">
          <Combobox
            options={customerOptions.map((customer) => ({
              value: customer.id,
              label: customer.companyName,
            }))}
            value={customerId}
            onValueChange={onCustomerChange}
            loading={customersLoading}
            placeholder={customerPlaceholder}
            searchPlaceholder={customerPlaceholder}
            emptyMessage={customerPlaceholder}
            clearable
          />
        </div>
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
