import { Search, X } from 'lucide-react';
import type { ReactNode } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ProvidersToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder: string;
  clearLabel: string;
  summary?: string | null;
  className?: string;
  actions?: ReactNode;
}

export function ProvidersToolbar({
  searchValue,
  onSearchChange,
  placeholder,
  clearLabel,
  summary,
  className,
  actions,
}: ProvidersToolbarProps) {
  return (
    <section
      className={cn(
        'flex flex-col gap-3 rounded-3xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm',
        className
      )}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label
          htmlFor="providers-search"
          className="flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-background/80 px-3 py-2 text-sm shadow-inner md:max-w-xl"
        >
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <Input
            id="providers-search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            className="h-auto border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0 md:text-sm"
          />
          {searchValue ? (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
              aria-label={clearLabel}
            >
              <X className="size-4" />
            </button>
          ) : null}
        </label>
        {summary ? (
          <p className="text-sm font-medium tracking-tight text-muted-foreground">{summary}</p>
        ) : null}
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </section>
  );
}
