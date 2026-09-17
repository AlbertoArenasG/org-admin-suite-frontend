import * as React from 'react';

import { Field, FieldContent, FieldGroup } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ResourceFormFrame,
  type ResourceFormContentSurface,
  type ResourceFormDensity,
  type ResourceFormDividers,
  type ResourceFormResponsiveValue,
  type ResourceFormSurface,
} from '@/components/resource-form/ResourceFormFrame';
import { ResourceFormSection } from '@/components/resource-form/ResourceFormSection';
import type { FormFieldOrientation } from '@/components/forms/FormField';
import { cn } from '@/lib/utils';

export type ResourceFormSkeletonGroup = {
  fields: number;
  orientation?: FormFieldOrientation;
};

type ResourceFormSkeletonProps = React.ComponentProps<'div'> & {
  groups?: readonly ResourceFormSkeletonGroup[];
  header?: boolean;
  headerActions?: number;
  footerActions?: number;
  density?: ResourceFormResponsiveValue<ResourceFormDensity>;
  surface?: ResourceFormResponsiveValue<ResourceFormSurface>;
  contentSurface?: ResourceFormResponsiveValue<ResourceFormContentSurface>;
  dividers?: ResourceFormDividers;
};

const DEFAULT_GROUPS: readonly ResourceFormSkeletonGroup[] = [
  { fields: 4, orientation: 'vertical' },
];

function ResourceFormSkeleton({
  className,
  contentSurface = 'bare',
  density = 'comfortable',
  dividers = 'visible',
  footerActions = 0,
  groups = DEFAULT_GROUPS,
  header = true,
  headerActions = 0,
  surface = 'card',
  ...props
}: ResourceFormSkeletonProps) {
  return (
    <div className={cn('w-full', className)} role="status" {...props}>
      <span className="sr-only">Cargando formulario</span>
      <ResourceFormFrame
        contentSurface={contentSurface}
        density={density}
        dividers={dividers}
        footerActions={footerActions > 0 ? <SkeletonActions count={footerActions} /> : undefined}
        headerActions={
          header && headerActions > 0 ? <SkeletonActions count={headerActions} /> : undefined
        }
        mode="read"
        status="loading"
        surface={surface}
        title={header ? <Skeleton className="h-5 w-52" /> : undefined}
        description={header ? <Skeleton className="h-4 w-80 max-w-full" /> : undefined}
      >
        <div className="grid gap-5">
          {groups.map((group, index) => (
            <React.Fragment key={`${group.orientation ?? 'vertical'}-${index}`}>
              {index > 0 ? <Separator /> : null}
              <ResourceFormSection surface="bare">
                <FieldGroup>
                  {Array.from({ length: group.fields }, (_, fieldIndex) => (
                    <SkeletonField
                      key={fieldIndex}
                      orientation={group.orientation ?? 'vertical'}
                      labelWidth={LABEL_WIDTHS[fieldIndex % LABEL_WIDTHS.length]}
                    />
                  ))}
                </FieldGroup>
              </ResourceFormSection>
            </React.Fragment>
          ))}
        </div>
      </ResourceFormFrame>
    </div>
  );
}

const LABEL_WIDTHS = ['w-20', 'w-16', 'w-28', 'w-14'] as const;

function SkeletonField({
  labelWidth,
  orientation,
}: {
  labelWidth: (typeof LABEL_WIDTHS)[number];
  orientation: FormFieldOrientation;
}) {
  return (
    <Field orientation={orientation}>
      <Skeleton className={cn('h-4', labelWidth)} />
      <FieldContent>
        <Skeleton className="h-9 w-full" />
      </FieldContent>
    </Field>
  );
}

function SkeletonActions({ count }: { count: number }) {
  return (
    <div className="flex justify-end gap-2">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton className={cn('h-9', index === count - 1 ? 'w-32' : 'w-24')} key={index} />
      ))}
    </div>
  );
}

export { ResourceFormSkeleton };
export type { ResourceFormSkeletonProps };
