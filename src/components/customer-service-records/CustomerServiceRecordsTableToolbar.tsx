'use client';

import { Filter, SlidersHorizontal } from 'lucide-react';
import type { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
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
    serviceTypePlaceholder: string;
    customerPlaceholder: string;
    providerPlaceholder: string;
    statusPlaceholder: string;
    providerStatePlaceholder: string;
    providerStateYes: string;
    providerStateNo: string;
    dateFilters: string;
    requestedAt: string;
    receivedAt: string;
    customerDeliveryAt: string;
    providerReturnAt: string;
    from: string;
    to: string;
    manageColumns: string;
    allStatuses: string;
    pending: string;
    inProgress: string;
    completed: string;
    cancelled: string;
  };
}

const statusOptions = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;

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
  const updateFilter = <Key extends keyof CustomerServiceRecordsListFilters>(
    key: Key,
    value: CustomerServiceRecordsListFilters[Key]
  ) => onFiltersChange((current) => ({ ...current, [key]: value }));

  const statusLabels = {
    PENDING: labels.pending,
    IN_PROGRESS: labels.inProgress,
    COMPLETED: labels.completed,
    CANCELLED: labels.cancelled,
  };

  return (
    <div className="border-b border-border/60 px-4 py-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={labels.searchPlaceholder}
            className="xl:col-span-2"
          />
          <Combobox
            options={serviceTypes}
            value={filters.serviceTypeCode}
            onValueChange={(value) => updateFilter('serviceTypeCode', value)}
            placeholder={labels.serviceTypePlaceholder}
            searchPlaceholder={labels.serviceTypePlaceholder}
            emptyMessage={labels.serviceTypePlaceholder}
            loading={loadingOptions}
            clearable
          />
          <Combobox
            options={customers}
            value={filters.customerId}
            onValueChange={(value) => updateFilter('customerId', value)}
            placeholder={labels.customerPlaceholder}
            searchPlaceholder={labels.customerPlaceholder}
            emptyMessage={labels.customerPlaceholder}
            loading={loadingOptions}
            clearable
          />
          <select
            value={filters.operationalStatus ?? ''}
            onChange={(event) =>
              updateFilter(
                'operationalStatus',
                event.target.value === ''
                  ? null
                  : (event.target.value as CustomerServiceRecordsListFilters['operationalStatus'])
              )
            }
            className="border-input focus-visible:ring-ring/50 h-10 rounded-md border bg-background px-3 text-sm shadow-xs focus-visible:outline-none"
          >
            <option value="">{labels.statusPlaceholder}</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
          <Combobox
            options={providers}
            value={filters.providerId}
            onValueChange={(value) => updateFilter('providerId', value)}
            placeholder={labels.providerPlaceholder}
            searchPlaceholder={labels.providerPlaceholder}
            emptyMessage={labels.providerPlaceholder}
            loading={loadingOptions}
            clearable
          />
          <select
            value={filters.hasProvider === null ? '' : String(filters.hasProvider)}
            onChange={(event) =>
              updateFilter(
                'hasProvider',
                event.target.value === '' ? null : event.target.value === 'true'
              )
            }
            className="border-input focus-visible:ring-ring/50 h-10 rounded-md border bg-background px-3 text-sm shadow-xs focus-visible:outline-none"
          >
            <option value="">{labels.providerStatePlaceholder}</option>
            <option value="true">{labels.providerStateYes}</option>
            <option value="false">{labels.providerStateNo}</option>
          </select>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 self-start xl:self-auto">
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
                  {(column.columnDef.meta as { label?: string } | undefined)?.label ?? column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <details className="group mt-3 rounded-xl border border-border/70 bg-muted/20">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-sm font-medium">
          <Filter className="size-4" />
          {labels.dateFilters}
        </summary>
        <div className="grid gap-3 border-t border-border/60 p-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['requestedAtFrom', 'requestedAtTo', labels.requestedAt],
            ['receivedAtFrom', 'receivedAtTo', labels.receivedAt],
            [
              'estimatedCustomerDeliveryAtFrom',
              'estimatedCustomerDeliveryAtTo',
              labels.customerDeliveryAt,
            ],
            [
              'providerEstimatedReturnAtFrom',
              'providerEstimatedReturnAtTo',
              labels.providerReturnAt,
            ],
          ].map(([fromKey, toKey, label]) => (
            <fieldset key={fromKey} className="grid gap-2">
              <legend className="text-xs font-medium text-muted-foreground">{label}</legend>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={String(filters[fromKey as keyof CustomerServiceRecordsListFilters] ?? '')}
                  aria-label={`${label} ${labels.from}`}
                  onChange={(event) =>
                    updateFilter(
                      fromKey as keyof CustomerServiceRecordsListFilters,
                      event.target.value || null
                    )
                  }
                />
                <Input
                  type="date"
                  value={String(filters[toKey as keyof CustomerServiceRecordsListFilters] ?? '')}
                  aria-label={`${label} ${labels.to}`}
                  onChange={(event) =>
                    updateFilter(
                      toKey as keyof CustomerServiceRecordsListFilters,
                      event.target.value || null
                    )
                  }
                />
              </div>
            </fieldset>
          ))}
        </div>
      </details>
    </div>
  );
}
