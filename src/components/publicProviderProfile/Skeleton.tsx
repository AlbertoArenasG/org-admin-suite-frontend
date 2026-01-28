export function PublicProviderProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-border/60 bg-card/60 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-52 rounded-lg bg-muted" />
          <div className="h-4 w-64 rounded-lg bg-muted" />
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`summary-${index}`} className="h-16 rounded-2xl bg-muted" />
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-border/60 bg-card/60 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-56 rounded-lg bg-muted" />
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={`form-${index}`} className="h-20 rounded-2xl bg-muted" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
