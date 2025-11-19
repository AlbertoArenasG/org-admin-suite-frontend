import { Skeleton } from '@/components/ui/skeleton';

export function CustomerDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-12 w-64 rounded-2xl" />
        <Skeleton className="h-4 w-72 rounded-lg" />
      </div>
      <div className="rounded-3xl border border-border/60 bg-card/60 p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-6 w-64 rounded-lg" />
            <Skeleton className="h-4 w-40 rounded-lg" />
          </div>
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={`general-${index}`} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="mt-6 h-10 w-48 rounded-full" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={`fiscal-${index}`}
            className="rounded-3xl border border-border/60 bg-card/60 p-6 shadow-sm space-y-4"
          >
            <Skeleton className="h-5 w-48 rounded-lg" />
            {Array.from({ length: 4 }).map((_, subIndex) => (
              <Skeleton key={`section-${index}-${subIndex}`} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        ))}
      </div>
      <div className="rounded-3xl border border-border/60 bg-card/60 p-6 shadow-sm space-y-4">
        <Skeleton className="h-5 w-40 rounded-lg" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={`contact-${index}`} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
