'use client';

import type { Table } from '@tanstack/react-table-v8';
import { SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { ComboboxOption } from '@/components/ui/combobox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import type {
  CustomerServiceRecordListItem,
  CustomerServiceRecordsListFilters,
} from '@/features/customer-service-records';

import { CustomerServiceRecordsFilterDialog } from './CustomerServiceRecordsFilterDialog';

interface CustomerServiceRecordsTableToolbarProps {
  table: Table<CustomerServiceRecordListItem>;
  filters: CustomerServiceRecordsListFilters;
  search: string;
  serviceTypes: ComboboxOption[];
  customers: ComboboxOption[];
  providers: ComboboxOption[];
  loadingOptions: boolean;
  onSearchChange: (value: string) => void;
  onFiltersChange: (
    updater: (current: CustomerServiceRecordsListFilters) => CustomerServiceRecordsListFilters
  ) => void;
  labels: {
    searchPlaceholder: string;
    manageColumns: string;
  };
}

export function CustomerServiceRecordsTableToolbar({
  table,
  filters,
  search,
  serviceTypes,
  customers,
  providers,
  loadingOptions,
  onSearchChange,
  onFiltersChange,
  labels,
}: CustomerServiceRecordsTableToolbarProps) {
  return (
    <div className="border-b border-border/60 px-4 py-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={labels.searchPlaceholder}
            className="flex-1"
          />
          <div className="flex shrink-0 flex-wrap gap-2">
            <CustomerServiceRecordsFilterDialog
              filters={filters}
              serviceTypes={serviceTypes}
              customers={customers}
              providers={providers}
              loadingOptions={loadingOptions}
              onFiltersChange={(nextFilters) => onFiltersChange(() => nextFilters)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="gap-2">
                  <SlidersHorizontal className="size-4" />
                  {labels.manageColumns}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>{labels.manageColumns}</DropdownMenuLabel>
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
                        column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
