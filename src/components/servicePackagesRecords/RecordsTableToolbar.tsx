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
import type { Table } from '@tanstack/react-table';
import { SlidersHorizontal } from 'lucide-react';
import type { ServicePackagesRecordsTableRow } from '@/components/servicePackagesRecords/useServicePackagesRecordsTableData';
import { useServicePackagesRecordsTableStore } from '@/components/servicePackagesRecords/useServicePackagesRecordsTableStore';
import type { ServicePackageRecordServiceTypeOption } from '@/features/servicePackagesRecords';

interface RecordsTableToolbarProps {
  table: Table<ServicePackagesRecordsTableRow>;
  searchPlaceholder: string;
  columnLabel: string;
  serviceTypeOptions: ServicePackageRecordServiceTypeOption[];
  serviceTypePlaceholder: string;
  loadingServiceTypeOptions: boolean;
}

export function RecordsTableToolbar({
  table,
  searchPlaceholder,
  columnLabel,
  serviceTypeOptions,
  serviceTypePlaceholder,
  loadingServiceTypeOptions,
}: RecordsTableToolbarProps) {
  const globalFilter = useServicePackagesRecordsTableStore((state) => state.globalFilter);
  const setGlobalFilter = useServicePackagesRecordsTableStore((state) => state.setGlobalFilter);
  const serviceType = useServicePackagesRecordsTableStore((state) => state.serviceType);
  const setServiceType = useServicePackagesRecordsTableStore((state) => state.setServiceType);

  return (
    <div className="flex flex-col gap-3 border-b border-border/60 px-4 pb-3 pt-2 xl:flex-row xl:items-center xl:justify-between">
      <div className="grid flex-1 gap-3 sm:grid-cols-2">
        <Input
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          placeholder={searchPlaceholder}
        />
        <select
          value={serviceType ?? ''}
          onChange={(event) => setServiceType(event.target.value || null)}
          disabled={loadingServiceTypeOptions}
          className="border-input focus-visible:ring-ring/50 h-10 rounded-md border bg-background px-3 text-sm shadow-xs focus-visible:outline-none disabled:cursor-wait disabled:opacity-60"
        >
          <option value="">{serviceTypePlaceholder}</option>
          {serviceTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
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
                  return label ?? column.id;
                })()}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
