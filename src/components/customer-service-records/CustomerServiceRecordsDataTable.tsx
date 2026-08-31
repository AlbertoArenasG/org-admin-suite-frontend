'use client';

import { flexRender, type Table } from '@tanstack/react-table';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomerServiceRecordsTableToolbar } from '@/components/customer-service-records/CustomerServiceRecordsTableToolbar';
import type {
  CustomerServiceRecordListItem,
  CustomerServiceRecordsListFilters,
} from '@/features/customer-service-records';
import type { ComboboxOption } from '@/components/ui/combobox';

interface CustomerServiceRecordsDataTableProps {
  table: Table<CustomerServiceRecordListItem>;
  filters: CustomerServiceRecordsListFilters;
  search: string;
  serviceTypes: ComboboxOption[];
  customers: ComboboxOption[];
  providers: ComboboxOption[];
  loadingOptions: boolean;
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  onSearchChange: (value: string) => void;
  onFiltersChange: (
    updater: (current: CustomerServiceRecordsListFilters) => CustomerServiceRecordsListFilters
  ) => void;
  canCreate: boolean;
  title: string;
  summary: string;
  createLabel: string;
  createHref: string;
  labels: {
    errorTitle: string;
    retry: string;
    loading: string;
    empty: string;
    previous: string;
    next: string;
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

export function CustomerServiceRecordsDataTable({
  table,
  filters,
  search,
  serviceTypes,
  customers,
  providers,
  loadingOptions,
  isLoading,
  error,
  onRetry,
  onSearchChange,
  onFiltersChange,
  canCreate,
  title,
  summary,
  createLabel,
  createHref,
  labels,
}: CustomerServiceRecordsDataTableProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '24px',
        border: '1px solid var(--surface-border)',
        bgcolor: 'var(--surface-bg)',
        color: 'var(--foreground)',
        boxShadow: 'var(--surface-shadow)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
        <div>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.foreground">
            {summary}
          </Typography>
        </div>
        {canCreate ? (
          <Button type="button" size="sm" className="gap-2" asChild>
            <Link href={createHref}>
              <Plus className="size-4" />
              {createLabel}
            </Link>
          </Button>
        ) : null}
      </div>

      <CustomerServiceRecordsTableToolbar
        table={table}
        filters={filters}
        search={search}
        serviceTypes={serviceTypes}
        customers={customers}
        providers={providers}
        loadingOptions={loadingOptions}
        onSearchChange={onSearchChange}
        onFiltersChange={onFiltersChange}
        labels={labels}
      />

      {isLoading ? (
        <LinearProgress
          sx={{
            backgroundColor: 'var(--data-grid-progress-track)',
            '& .MuiLinearProgress-bar': { backgroundColor: 'var(--data-grid-progress-bar)' },
          }}
        />
      ) : null}

      {error ? (
        <Box sx={{ px: 3, pt: 3 }}>
          <Alert severity="error">
            <AlertTitle>{labels.errorTitle}</AlertTitle>
            {error}
            {onRetry ? (
              <div className="mt-3">
                <Button type="button" variant="outline" size="sm" onClick={onRetry}>
                  {labels.retry}
                </Button>
              </div>
            ) : null}
          </Alert>
        </Box>
      ) : null}

      <div className="flex-1 overflow-x-auto">
        <table className="w-full min-w-[1240px] border-collapse text-sm">
          <thead className="bg-[var(--data-grid-header-bg)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-[var(--data-grid-header-border)]">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[var(--data-grid-cell-border)] last:border-b-0 hover:bg-[var(--data-grid-row-hover)]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={table.getVisibleLeafColumns().length}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  {isLoading ? labels.loading : labels.empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-border/60 px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {labels.previous}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {labels.next}
        </Button>
      </div>
    </Paper>
  );
}
