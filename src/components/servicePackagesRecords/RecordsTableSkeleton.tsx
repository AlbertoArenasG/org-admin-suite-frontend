'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface RecordsTableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function RecordsTableSkeleton({ rows = 6, columns = 6 }: RecordsTableSkeletonProps) {
  return (
    <div className="flex flex-col gap-3 p-4">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`skeleton-row-${rowIndex}`} className="grid grid-cols-1 gap-3 md:grid-cols-6">
          {Array.from({ length: columns }).map((__, columnIndex) => (
            <Skeleton
              key={`skeleton-cell-${rowIndex}-${columnIndex}`}
              className="h-10 rounded-xl bg-muted/70"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
