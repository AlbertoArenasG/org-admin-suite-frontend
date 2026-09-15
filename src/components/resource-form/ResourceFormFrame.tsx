import * as React from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  resolveResponsiveValue,
  responsiveClasses,
  type ResourceFormResponsiveValue,
} from '@/components/resource-form/resource-form-presentation';

export type ResourceFormMode = 'read' | 'edit';
export type ResourceFormStatus = 'idle' | 'loading' | 'saving' | 'error';
export type ResourceFormSurface = 'card' | 'bare';
export type ResourceFormDensity = 'comfortable' | 'compact' | 'none';
export type ResourceFormContentSurface = 'bare' | 'inset';
export type ResourceFormDividers = 'visible' | 'hidden';

type ResourceFormFrameProps = Omit<React.ComponentProps<typeof Card>, 'title'> & {
  mode: ResourceFormMode;
  status?: ResourceFormStatus;
  surface?: ResourceFormResponsiveValue<ResourceFormSurface>;
  density?: ResourceFormResponsiveValue<ResourceFormDensity>;
  contentSurface?: ResourceFormResponsiveValue<ResourceFormContentSurface>;
  dividers?: ResourceFormDividers;
  title?: React.ReactNode;
  description?: React.ReactNode;
  feedback?: React.ReactNode;
  headerActions?: React.ReactNode;
  footerActions?: React.ReactNode;
  children: React.ReactNode;
};

function ResourceFormFrame({
  children,
  className,
  contentSurface = 'bare',
  dividers = 'visible',
  description,
  feedback,
  footerActions,
  headerActions,
  mode,
  density = 'comfortable',
  surface = 'card',
  status = 'idle',
  title,
  ...props
}: ResourceFormFrameProps) {
  const isBusy = status === 'loading' || status === 'saving';
  const hasHeader = Boolean(title || description || headerActions);
  const resolvedDensity = resolveResponsiveValue(density, 'comfortable');
  const resolvedSurface = resolveResponsiveValue(surface, 'card');
  const resolvedContentSurface = resolveResponsiveValue(contentSurface, 'bare');
  const contentSpacing = {
    base: {
      comfortable: 'space-y-4 px-6 py-5',
      compact: 'space-y-3 px-4 py-4',
      none: 'space-y-0 px-0 py-0',
    }[resolvedDensity.base],
    md: {
      comfortable: 'md:space-y-4 md:px-6 md:py-5',
      compact: 'md:space-y-3 md:px-4 md:py-4',
      none: 'md:space-y-0 md:px-0 md:py-0',
    }[resolvedDensity.md ?? resolvedDensity.base],
  };
  const contentOuterClasses = cn(
    resolvedContentSurface.base === 'inset' ? 'p-1' : contentSpacing.base,
    resolvedContentSurface.md === 'inset' ? 'md:p-1' : contentSpacing.md
  );
  const contentInnerClasses = cn(
    resolvedContentSurface.base === 'inset'
      ? cn('block rounded-lg border border-border/80 bg-card', contentSpacing.base)
      : 'contents',
    resolvedContentSurface.md === 'inset'
      ? cn('md:block md:rounded-lg md:border md:border-border/80 md:bg-card', contentSpacing.md)
      : 'md:contents'
  );
  const spacing = {
    footer: responsiveClasses(density, 'comfortable', {
      base: {
        comfortable: 'px-6 py-4',
        compact: 'px-4 py-3',
        none: 'px-0 py-0',
      },
      md: {
        comfortable: 'md:px-6 md:py-4',
        compact: 'md:px-4 md:py-3',
        none: 'md:px-0 md:py-0',
      },
    }),
    header: responsiveClasses(density, 'comfortable', {
      base: {
        comfortable: 'gap-1 px-6 py-5',
        compact: 'gap-1 px-4 py-3',
        none: 'gap-1 px-0 py-0',
      },
      md: {
        comfortable: 'md:gap-1 md:px-6 md:py-5',
        compact: 'md:gap-1 md:px-4 md:py-3',
        none: 'md:gap-1 md:px-0 md:py-0',
      },
    }),
  };
  const surfaceClasses = responsiveClasses(surface, 'card', {
    base: {
      bare: 'border-0 bg-transparent shadow-none',
      card: 'border bg-card shadow-sm',
    },
    md: {
      bare: 'md:border-0 md:bg-transparent md:shadow-none',
      card: 'md:border md:bg-card md:shadow-sm',
    },
  });
  const frameDividerClasses = responsiveClasses(surface, 'card', {
    base: {
      bare: 'border-0',
      card: 'border-b',
    },
    md: {
      bare: 'md:border-0',
      card: 'md:border-b',
    },
  });
  const headerDividerClasses = dividers === 'visible' ? frameDividerClasses : 'border-0';
  const footerDividerClasses =
    dividers === 'visible'
      ? responsiveClasses(surface, 'card', {
          base: {
            bare: 'border-0',
            card: 'border-t',
          },
          md: {
            bare: 'md:border-0',
            card: 'md:border-t',
          },
        })
      : 'border-0';

  return (
    <Card
      aria-busy={isBusy || undefined}
      className={cn('gap-0 p-0', surfaceClasses, className)}
      data-density={resolvedDensity.base}
      data-density-md={resolvedDensity.md}
      data-content-surface={resolvedContentSurface.base}
      data-content-surface-md={resolvedContentSurface.md}
      data-dividers={dividers}
      data-mode={mode}
      data-slot="resource-form-frame"
      data-status={status}
      data-surface={resolvedSurface.base}
      data-surface-md={resolvedSurface.md}
      {...props}
    >
      {hasHeader ? (
        <CardHeader className={cn(spacing.header, headerDividerClasses)}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              {title ? <h2 className="leading-none font-semibold">{title}</h2> : null}
              {description ? <CardDescription>{description}</CardDescription> : null}
            </div>
            {headerActions ? (
              <div data-slot="resource-form-frame-header-actions">{headerActions}</div>
            ) : null}
          </div>
        </CardHeader>
      ) : null}
      <CardContent className={contentOuterClasses}>
        <div className={contentInnerClasses}>
          {feedback ? <div data-slot="resource-form-feedback">{feedback}</div> : null}
          {children}
        </div>
      </CardContent>
      {footerActions ? (
        <CardFooter className={cn(spacing.footer, footerDividerClasses)}>
          <div className="w-full" data-slot="resource-form-frame-footer-actions">
            {footerActions}
          </div>
        </CardFooter>
      ) : null}
    </Card>
  );
}

export { ResourceFormFrame };
export type { ResourceFormFrameProps, ResourceFormResponsiveValue };
