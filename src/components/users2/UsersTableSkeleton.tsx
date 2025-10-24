'use client';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Skeleton } from '@/components/ui/skeleton';

interface UsersTableSkeletonProps {
  columns?: number;
  rows?: number;
}

const DEFAULT_COLUMNS = ['Usuario', 'Correo', 'Rol', 'Estado', 'Creado', ''];

export function UsersTableSkeleton({
  columns = DEFAULT_COLUMNS.length,
  rows = 8,
}: UsersTableSkeletonProps) {
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
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>

      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
        <Skeleton className="h-9 w-full max-w-md" />
        <Skeleton className="h-9 w-40" />
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead className="bg-[var(--data-grid-header-bg)]">
            <tr className="border-b border-[var(--data-grid-header-border)]">
              {Array.from({ length: columns }).map((_, index) => (
                <th key={`header-${index}`} className="px-4 py-3 text-left font-semibold">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr
                key={`row-${rowIndex}`}
                className="border-b border-[var(--data-grid-cell-border)] last:border-b-0"
              >
                {Array.from({ length: columns }).map((__, columnIndex) => (
                  <td key={`cell-${rowIndex}-${columnIndex}`} className="px-4 py-3">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Box className="flex items-center justify-end gap-2 border-t border-border/60 px-4 py-3">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </Box>
    </Paper>
  );
}
