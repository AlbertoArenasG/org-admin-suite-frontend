'use client';

import type { Table } from '@tanstack/react-table';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import type {
  InternalAssetMaintenanceCatalog,
  InternalAssetMaintenanceRecordStatusId,
  InternalAssetMaintenanceTypeId,
} from '@/features/internal-asset-control/types';
import type { InternalAssetControlTableRow } from '@/components/internal-asset-control/types';
import { useInternalAssetControlTableStore } from '@/components/internal-asset-control/useInternalAssetControlTableStore';

interface InternalAssetControlTableToolbarProps {
  table: Table<InternalAssetControlTableRow>;
  catalogs: InternalAssetMaintenanceCatalog | null;
  labels: {
    searchPlaceholder: string;
    columnLabel: string;
    assetMaintenanceTypePlaceholder: string;
    statusPlaceholder: string;
    sentToProviderPlaceholder: string;
    sentToProviderYes: string;
    sentToProviderNo: string;
  };
}

export function InternalAssetControlTableToolbar({
  table,
  catalogs,
  labels,
}: InternalAssetControlTableToolbarProps) {
  const globalFilter = useInternalAssetControlTableStore((state) => state.globalFilter);
  const filters = useInternalAssetControlTableStore((state) => state.filters);
  const setGlobalFilter = useInternalAssetControlTableStore((state) => state.setGlobalFilter);
  const setFilters = useInternalAssetControlTableStore((state) => state.setFilters);
  const setPagination = useInternalAssetControlTableStore((state) => state.setPagination);

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
            value={filters.assetMaintenanceType ?? ''}
            onChange={(event) => {
              const nextValue = event.target.value as InternalAssetMaintenanceTypeId | '';
              setFilters((current) => ({
                ...current,
                assetMaintenanceType: nextValue || null,
              }));
              setPagination((current) => ({ ...current, pageIndex: 0 }));
            }}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">{labels.assetMaintenanceTypePlaceholder}</option>
            {catalogs?.assetMaintenanceTypes.map((type) => (
              <option key={type.code} value={type.code}>
                {type.name}
              </option>
            ))}
          </select>
          <select
            value={filters.status ?? ''}
            onChange={(event) => {
              const nextValue = event.target.value as InternalAssetMaintenanceRecordStatusId | '';
              setFilters((current) => ({
                ...current,
                status: nextValue || null,
              }));
              setPagination((current) => ({ ...current, pageIndex: 0 }));
            }}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">{labels.statusPlaceholder}</option>
            {catalogs?.statuses.map((status) => (
              <option key={status.code} value={status.code}>
                {status.name}
              </option>
            ))}
          </select>
          <select
            value={filters.sentToProvider === null ? '' : filters.sentToProvider ? 'true' : 'false'}
            onChange={(event) => {
              const nextValue = event.target.value;
              setFilters((current) => ({
                ...current,
                sentToProvider: nextValue === '' ? null : nextValue === 'true' ? true : false,
              }));
              setPagination((current) => ({ ...current, pageIndex: 0 }));
            }}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">{labels.sentToProviderPlaceholder}</option>
            <option value="true">{labels.sentToProviderYes}</option>
            <option value="false">{labels.sentToProviderNo}</option>
          </select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="size-4" />
                {labels.columnLabel}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
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
