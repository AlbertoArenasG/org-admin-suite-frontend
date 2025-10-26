'use client';

import { Skeleton } from '@/components/ui/skeleton';
import Paper from '@mui/material/Paper';

export function PublicServiceEntrySkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <Skeleton className="h-6 w-40 rounded-lg self-start" />
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
        <div className="px-6 py-6">
          <Skeleton className="h-8 w-56 rounded-lg" />
          <Skeleton className="mt-2 h-4 w-36 rounded-lg" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </Paper>
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
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
          <div className="px-6 py-4">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <Skeleton className="mt-2 h-4 w-64 rounded-lg" />
          </div>
          <div className="flex flex-col gap-4 px-6 py-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-xl" />
            ))}
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-full self-end" />
          </div>
        </Paper>
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
          <div className="px-6 py-4">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <Skeleton className="mt-2 h-4 w-72 rounded-lg" />
          </div>
          <div className="flex flex-col gap-4 px-6 py-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </Paper>
      </div>
    </div>
  );
}
