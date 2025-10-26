'use client';

import { flexRender, type Table } from '@tanstack/react-table';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button } from '@/components/ui/button';
import type { UsersTableUser } from '@/components/users2/types';
import { UsersTableToolbar } from '@/components/users2/UsersTableToolbar';
import { UsersDeleteDialog } from '@/components/users2/UsersDeleteDialog';
import { UsersTableSkeleton } from '@/components/users2/UsersTableSkeleton';

interface UsersDataTableProps {
  table: Table<UsersTableUser>;
  isLoading: boolean;
  error: string | null;
  onInviteClick: () => void;
  title: string;
  inviteLabel: string;
  inviteAriaLabel: string;
  paginationSummary: string | null;
  searchPlaceholder: string;
  columnLabel: string;
  deleteDialog: {
    open: boolean;
    user: UsersTableUser | null;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isLoading?: boolean;
    labels: {
      title: string;
      description: string;
      warning: string;
      cancel: string;
      confirm: string;
    };
  };
  tableLabels: {
    noData: string;
    pagination: {
      previous: string;
      next: string;
    };
  };
}

export function UsersDataTable({
  table,
  isLoading,
  error,
  onInviteClick,
  title,
  inviteLabel,
  inviteAriaLabel,
  paginationSummary,
  searchPlaceholder,
  columnLabel,
  deleteDialog,
  tableLabels,
}: UsersDataTableProps) {
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
          {paginationSummary ? (
            <Typography variant="caption" color="text.secondary">
              {paginationSummary}
            </Typography>
          ) : null}
        </div>
        <Button type="button" size="sm" onClick={onInviteClick} aria-label={inviteAriaLabel}>
          {inviteLabel}
        </Button>
      </div>

      <UsersTableToolbar
        table={table}
        searchPlaceholder={searchPlaceholder}
        columnLabel={columnLabel}
      />

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
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        </Box>
      ) : null}

      <div className="flex-1 overflow-x-auto">
        {isLoading ? (
          <UsersTableSkeleton rows={8} columns={table.getAllColumns().length || 6} />
        ) : (
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead className="bg-[var(--data-grid-header-bg)]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-[var(--data-grid-header-border)]"
                >
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
                    {tableLabels.noData}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-border/60 px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {tableLabels.pagination.previous}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {tableLabels.pagination.next}
        </Button>
      </div>

      <UsersDeleteDialog {...deleteDialog} />
    </Paper>
  );
}
