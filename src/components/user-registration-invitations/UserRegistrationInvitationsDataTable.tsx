'use client';

import { flexRender, type Table } from '@tanstack/react-table';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { Button } from '@/components/ui/button';
import { UserRegistrationInvitationsTableSkeleton } from './UserRegistrationInvitationsTableSkeleton';
import { UserRegistrationInvitationsTableToolbar } from './UserRegistrationInvitationsTableToolbar';
import type { UserRegistrationInvitationsTableRow } from './types';

interface UserRegistrationInvitationsDataTableProps {
  table: Table<UserRegistrationInvitationsTableRow>;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onCreateClick: () => void;
  canCreate: boolean;
  title: string;
  description: string;
  createLabel: string;
  createAriaLabel: string;
  paginationSummary: string | null;
  noData: string;
  errorTitle: string;
  retryLabel: string;
  toolbarLabels: React.ComponentProps<typeof UserRegistrationInvitationsTableToolbar>['labels'];
  tableLabels: {
    previous: string;
    next: string;
  };
}

export function UserRegistrationInvitationsDataTable({
  table,
  isLoading,
  error,
  onRetry,
  onCreateClick,
  canCreate,
  title,
  description,
  createLabel,
  createAriaLabel,
  paginationSummary,
  noData,
  errorTitle,
  retryLabel,
  toolbarLabels,
  tableLabels,
}: UserRegistrationInvitationsDataTableProps) {
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
            {paginationSummary ?? description}
          </Typography>
        </div>
        {canCreate ? (
          <Button type="button" size="sm" onClick={onCreateClick} aria-label={createAriaLabel}>
            {createLabel}
          </Button>
        ) : null}
      </div>

      <UserRegistrationInvitationsTableToolbar table={table} labels={toolbarLabels} />

      {isLoading ? (
        <LinearProgress
          sx={{
            backgroundColor: 'var(--data-grid-progress-track)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'var(--data-grid-progress-bar)',
            },
          }}
        />
      ) : null}

      {error ? (
        <Box sx={{ px: 3, pt: 3 }}>
          <Alert severity="error">
            <AlertTitle>{errorTitle}</AlertTitle>
            {error}
            <div className="mt-3">
              <Button type="button" variant="outline" size="sm" onClick={onRetry}>
                {retryLabel}
              </Button>
            </div>
          </Alert>
        </Box>
      ) : null}

      <div className="flex-1 overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-sm">
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
            {isLoading ? (
              <UserRegistrationInvitationsTableSkeleton
                rows={8}
                columns={table.getVisibleLeafColumns().length}
              />
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`border-b border-[var(--data-grid-cell-border)] last:border-b-0 hover:bg-[var(--data-grid-row-hover)] ${
                    row.original.hasDeliveryFailure ? 'border-l-2 border-l-amber-500' : ''
                  }`}
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
                  {noData}
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
          disabled={!table.getCanPreviousPage() || isLoading}
        >
          {tableLabels.previous}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || isLoading}
        >
          {tableLabels.next}
        </Button>
      </div>
    </Paper>
  );
}
