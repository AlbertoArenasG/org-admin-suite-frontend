'use client';

import { flexRender, type Table } from '@tanstack/react-table';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from '@/components/ui/button';
import type { ServiceEntrySurveyTableRow } from '@/components/serviceEntrySurveys/useServiceEntrySurveyTableData';
import { SERVICE_ENTRY_SURVEY_RATING_CLASSES } from '@/components/serviceEntrySurveys/constants';

interface ServiceEntrySurveyDataTableProps {
  table: Table<ServiceEntrySurveyTableRow>;
  isLoading: boolean;
  error: string | null;
  paginationSummary: string | null;
  title: string;
  labels: {
    empty: string;
    pagination: {
      previous: string;
      next: string;
    };
    fields: {
      submittedAt: string;
      ratings: string;
      observations: string;
      serviceOrder: string;
      contact: string;
      email: string;
    };
  };
  ratingQuestions: Array<{ id: string; label: string }>;
  ratingValueLabels: Record<string, string>;
  formatDate: (value: string) => string;
}

export function ServiceEntrySurveyDataTable({
  table,
  isLoading,
  error,
  paginationSummary,
  title,
  labels,
  ratingQuestions,
  ratingValueLabels,
  formatDate,
}: ServiceEntrySurveyDataTableProps) {
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
      }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
        <div>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.05rem' }}>
            {title}
          </Typography>
          {paginationSummary ? (
            <Typography variant="caption" color="text.secondary">
              {paginationSummary}
            </Typography>
          ) : null}
        </div>
      </div>

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

      <div className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
            {labels.empty}
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[1024px] border-collapse text-sm">
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
                          <td key={cell.id} className="px-4 py-3 align-top">
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
                        {labels.empty}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 px-4 py-6 md:hidden">
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => {
                  const data = row.original;
                  return (
                    <div
                      key={row.id}
                      className="rounded-3xl border border-border/60 bg-card/70 p-4 shadow-sm"
                    >
                      <div className="flex flex-col gap-2">
                        <div>
                          <p className="text-base font-semibold text-foreground">
                            {data.companyName}
                          </p>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            {data.categoryName}
                          </p>
                        </div>
                        <div className="grid gap-1 text-xs text-muted-foreground">
                          <span className="font-mono text-xs uppercase text-foreground/80">
                            {labels.fields.serviceOrder}: {data.serviceOrder}
                          </span>
                          <span>
                            {labels.fields.contact}: {data.contactName}
                          </span>
                          <span className="break-all">
                            {labels.fields.email}: {data.contactEmail}
                          </span>
                          <span className="text-sm text-foreground">
                            {labels.fields.submittedAt}: {formatDate(data.submittedAt)}
                          </span>
                        </div>
                        <div className="mt-3 space-y-2">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {labels.fields.ratings}
                          </p>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {ratingQuestions.map((question) => {
                              const value = data.ratings[question.id];
                              return (
                                <div key={question.id} className="flex flex-col gap-1">
                                  <span className="text-xs font-medium text-muted-foreground">
                                    {question.label}
                                  </span>
                                  <span
                                    className={`inline-flex w-max rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${value ? SERVICE_ENTRY_SURVEY_RATING_CLASSES[value] : 'bg-muted text-muted-foreground'}`}
                                  >
                                    {value ? (ratingValueLabels[value] ?? value) : '—'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="mt-3 space-y-1">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {labels.fields.observations}
                          </p>
                          <p className="text-sm text-foreground/80">{data.observations || '—'}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-sm text-muted-foreground">{labels.empty}</div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-border/60 px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {labels.pagination.previous}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {labels.pagination.next}
        </Button>
      </div>
    </Paper>
  );
}
