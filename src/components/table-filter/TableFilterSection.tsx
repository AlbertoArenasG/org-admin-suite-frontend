import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import type { TableFilterSectionLayout } from './types';

interface TableFilterSectionProps {
  title?: ReactNode;
  description?: ReactNode;
  layout?: TableFilterSectionLayout;
  children: ReactNode;
  className?: string;
}

export function TableFilterSection({
  title,
  description,
  layout = 'one-column',
  children,
  className,
}: TableFilterSectionProps) {
  return (
    <section
      className={cn('border-t border-border/60 py-4 first:border-t-0 first:pt-0', className)}
    >
      {title || description ? (
        <header className="mb-3 space-y-1">
          {title ? <h3 className="text-sm font-semibold text-foreground">{title}</h3> : null}
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </header>
      ) : null}
      <div className={cn('grid gap-3', layout === 'two-columns' && 'md:grid-cols-2')}>
        {children}
      </div>
    </section>
  );
}
