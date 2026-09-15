import * as React from 'react';

import { cn } from '@/lib/utils';
import type { ResourceFormDensity } from '@/components/resource-form/ResourceFormFrame';
import {
  resolveResponsiveValue,
  responsiveClasses,
  type ResourceFormResponsiveValue,
} from '@/components/resource-form/resource-form-presentation';

export type ResourceFormSectionSurface = 'bare' | 'card';

type ResourceFormSectionProps = React.ComponentProps<'section'> & {
  density?: ResourceFormResponsiveValue<ResourceFormDensity>;
  surface?: ResourceFormResponsiveValue<ResourceFormSectionSurface>;
  title?: React.ReactNode;
  description?: React.ReactNode;
  headerActions?: React.ReactNode;
  footerActions?: React.ReactNode;
  children?: React.ReactNode;
};

function ResourceFormSection({
  children,
  className,
  description,
  density = 'comfortable',
  footerActions,
  headerActions,
  surface = 'bare',
  title,
  ...props
}: ResourceFormSectionProps) {
  const headingId = React.useId();
  const hasHeader = Boolean(title || description || headerActions);
  const resolvedDensity = resolveResponsiveValue(density, 'comfortable');
  const resolvedSurface = resolveResponsiveValue(surface, 'bare');
  const spacing = responsiveClasses(density, 'comfortable', {
    base: {
      comfortable: 'space-y-4',
      compact: 'space-y-3',
      none: 'space-y-0',
    },
    md: {
      comfortable: 'md:space-y-4',
      compact: 'md:space-y-3',
      none: 'md:space-y-0',
    },
  });
  const surfaceClasses = responsiveClasses(surface, 'bare', {
    base: {
      bare: 'border-0 bg-transparent shadow-none',
      card: 'rounded-xl border border-border/80 bg-card shadow-sm',
    },
    md: {
      bare: 'md:border-0 md:bg-transparent md:shadow-none',
      card: 'md:rounded-xl md:border md:border-border/80 md:bg-card md:shadow-sm',
    },
  });
  const sectionPadding = {
    base: {
      comfortable: 'p-5 sm:p-6',
      compact: 'p-4',
      none: 'p-0',
    },
    md: {
      comfortable: 'md:p-6',
      compact: 'md:p-4',
      none: 'md:p-0',
    },
  };
  const surfaceSpacing = cn(
    resolvedSurface.base === 'card' && sectionPadding.base[resolvedDensity.base],
    resolvedSurface.md === 'card' && sectionPadding.md[resolvedDensity.md ?? resolvedDensity.base]
  );

  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      className={cn(
        spacing,
        'scroll-mt-[var(--resource-form-scroll-offset,6rem)] md:scroll-mt-[var(--resource-form-scroll-offset-md,0rem)]',
        surfaceClasses,
        surfaceSpacing,
        className
      )}
      data-density={resolvedDensity.base}
      data-density-md={resolvedDensity.md}
      data-slot="resource-form-section"
      data-surface={resolvedSurface.base}
      data-surface-md={resolvedSurface.md}
      {...props}
    >
      {hasHeader ? (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            {title ? (
              <h3 className="font-medium" id={headingId}>
                {title}
              </h3>
            ) : null}
            {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
          </div>
          {headerActions ? (
            <div data-slot="resource-form-section-header-actions">{headerActions}</div>
          ) : null}
        </div>
      ) : null}
      {children ? <div data-slot="resource-form-section-content">{children}</div> : null}
      {footerActions ? (
        <div className="border-t pt-3" data-slot="resource-form-section-footer-actions">
          {footerActions}
        </div>
      ) : null}
    </section>
  );
}

export { ResourceFormSection };
export type { ResourceFormSectionProps };
