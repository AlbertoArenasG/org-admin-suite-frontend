import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProvidersPaginationProps {
  page: number;
  totalPages: number;
  summary?: string | null;
  onPageChange: (page: number) => void;
  labels: {
    previous: string;
    next: string;
  };
  disabled?: boolean;
  className?: string;
}

export function ProvidersPagination({
  page,
  totalPages,
  summary,
  onPageChange,
  labels,
  disabled = false,
  className,
}: ProvidersPaginationProps) {
  if (totalPages <= 1 && !summary) {
    return null;
  }

  const canGoPrevious = page > 1;
  const canGoNext = totalPages > 0 && page < totalPages;

  return (
    <section
      className={cn(
        'flex flex-col gap-3 rounded-3xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      {summary ? <p className="text-sm text-muted-foreground">{summary}</p> : <span />}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!canGoPrevious || disabled}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          {labels.previous}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!canGoNext || disabled}
          onClick={() => onPageChange(page + 1)}
        >
          {labels.next}
        </Button>
      </div>
    </section>
  );
}
