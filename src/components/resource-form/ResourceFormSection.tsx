import * as React from 'react';

import { cn } from '@/lib/utils';

type ResourceFormSectionProps = React.ComponentProps<'section'> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

function ResourceFormSection({
  actions,
  children,
  className,
  description,
  title,
  ...props
}: ResourceFormSectionProps) {
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn('space-y-4', className)}
      data-slot="resource-form-section"
      {...props}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="font-medium" id={headingId}>
            {title}
          </h3>
          {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
        </div>
        {actions ? <div data-slot="resource-form-section-actions">{actions}</div> : null}
      </div>
      <div data-slot="resource-form-section-content">{children}</div>
    </section>
  );
}

export { ResourceFormSection };
export type { ResourceFormSectionProps };
