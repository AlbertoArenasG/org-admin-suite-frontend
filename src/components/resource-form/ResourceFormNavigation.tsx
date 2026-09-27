'use client';

import * as React from 'react';

import {
  responsiveClasses,
  type ResourceFormResponsiveValue,
} from '@/components/resource-form/resource-form-presentation';
import { useResourceFormNavigation } from '@/components/resource-form/useResourceFormNavigation';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export type ResourceFormNavigationVariant = 'tabs' | 'sidebar';

export type ResourceFormNavigationItem = {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
};

type ResourceFormNavigationProps = {
  items: readonly ResourceFormNavigationItem[];
  variant?: ResourceFormResponsiveValue<ResourceFormNavigationVariant>;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  ariaLabel?: string;
  className?: string;
  sticky?: boolean;
  stickyOffset?: string;
};

type ResourceFormNavigationSkeletonProps = {
  itemCount: number;
  variant?: ResourceFormResponsiveValue<ResourceFormNavigationVariant>;
  className?: string;
  sticky?: boolean;
  stickyOffset?: string;
};

function ResourceFormNavigation({
  ariaLabel = 'Navegación del formulario',
  className,
  items,
  scrollContainerRef,
  sticky = false,
  stickyOffset = '0px',
  variant = { base: 'tabs', md: 'sidebar' },
}: ResourceFormNavigationProps) {
  const { activeId, navigate } = useResourceFormNavigation({ items, scrollContainerRef });

  const navigationClasses = getNavigationClasses(variant);

  const handleNavigate = (id: string) => {
    const target = document.getElementById(id);

    if (!target) {
      return;
    }

    navigate(id);
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        'flex min-w-0 gap-1',
        sticky && 'sticky top-0 z-20 bg-background py-2',
        navigationClasses,
        className
      )}
      data-slot="resource-form-navigation"
      style={sticky ? { top: stickyOffset } : undefined}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;

        return (
          <button
            aria-current={isActive ? 'location' : undefined}
            className={cn(
              'min-w-max rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
            key={item.id}
            onClick={() => handleNavigate(item.id)}
            type="button"
          >
            <span className="block">{item.label}</span>
            {item.description ? (
              <span className="mt-0.5 block text-xs font-normal opacity-80">
                {item.description}
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}

function ResourceFormNavigationSkeleton({
  className,
  itemCount,
  sticky = false,
  stickyOffset = '0px',
  variant = { base: 'tabs', md: 'sidebar' },
}: ResourceFormNavigationSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex min-w-0 gap-1',
        sticky && 'sticky top-0 z-20 bg-background py-2',
        getNavigationClasses(variant),
        className
      )}
      data-slot="resource-form-navigation-skeleton"
      style={sticky ? { top: stickyOffset } : undefined}
    >
      {Array.from({ length: itemCount }, (_, index) => (
        <Skeleton
          className={cn('h-9 shrink-0 rounded-lg', index % 3 === 0 ? 'w-36' : 'w-28')}
          key={index}
        />
      ))}
    </div>
  );
}

function getNavigationClasses(variant: ResourceFormResponsiveValue<ResourceFormNavigationVariant>) {
  return responsiveClasses(variant, 'tabs', {
    base: {
      tabs: 'flex-row overflow-x-auto border-b border-border pb-2',
      sidebar: 'flex-col rounded-xl border border-border/80 bg-card p-2',
    },
    md: {
      tabs: 'md:flex-row md:overflow-x-auto md:border-b md:pb-2',
      sidebar:
        'md:flex-col md:overflow-visible md:rounded-xl md:border md:border-border/80 md:bg-card md:p-2',
    },
  });
}

export { ResourceFormNavigation, ResourceFormNavigationSkeleton };
export type { ResourceFormNavigationProps, ResourceFormNavigationSkeletonProps };
