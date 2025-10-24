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
import type { UsersTableUser } from '@/components/users2/types';

interface UsersTableToolbarProps {
  table: Table<UsersTableUser>;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  searchPlaceholder: string;
  columnLabel: string;
}

export function UsersTableToolbar({
  table,
  globalFilter,
  onGlobalFilterChange,
  searchPlaceholder,
  columnLabel,
}: UsersTableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border/60 px-4 pb-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
      <Input
        value={globalFilter}
        onChange={(event) => onGlobalFilterChange(event.target.value)}
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
                {column.columnDef.header as string}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
