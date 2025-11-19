import { Skeleton } from '@/components/ui/skeleton';

interface CustomersSkeletonGridProps {
  items?: number;
}

export function CustomersSkeletonGrid({ items = 6 }: CustomersSkeletonGridProps) {
  const placeholders = Array.from({ length: items });

  return (
    <div
      className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {placeholders.map((_, index) => (
        <div
          key={`customer-skeleton-${index}`}
          className="rounded-3xl border border-border/60 bg-card/60 p-6 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-40 rounded-lg" />
              <Skeleton className="h-4 w-28 rounded-lg" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="mt-6 space-y-4">
            <Skeleton className="h-4 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-2/3 rounded-lg" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-14 w-full rounded-2xl" />
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
