import * as React from 'react';

import {
  ResourceFormNavigation,
  ResourceFormNavigationSkeleton,
  type ResourceFormNavigationItem,
  type ResourceFormNavigationVariant,
} from '@/components/resource-form/ResourceFormNavigation';
import {
  resolveResponsiveValue,
  type ResourceFormResponsiveValue,
} from '@/components/resource-form/resource-form-presentation';
import { cn } from '@/lib/utils';

type ResourceFormRouteProps = React.ComponentProps<'div'> & {
  children: React.ReactNode;
  compactNavigation?: React.ReactNode;
  navigationSupplement?: React.ReactNode;
  navigation?: {
    items: readonly ResourceFormNavigationItem[];
    variant?: ResourceFormResponsiveValue<ResourceFormNavigationVariant>;
    scrollContainerRef?: React.RefObject<HTMLElement | null>;
    ariaLabel?: string;
    className?: string;
    sticky?: boolean;
    stickyOffset?: string;
    loading?: boolean;
  };
  header?: React.ReactNode;
  footer?: React.ReactNode;
  stickyHeader?: boolean;
  stickyFooter?: boolean;
  stickyHeaderOffset?: string;
};

function ResourceFormRoute({
  children,
  className,
  compactNavigation,
  footer,
  header,
  navigation,
  navigationSupplement,
  stickyFooter = false,
  stickyHeader = false,
  stickyHeaderOffset = '0px',
  style,
  ...props
}: ResourceFormRouteProps) {
  const navigationVariant = resolveResponsiveValue(navigation?.variant, 'tabs');
  const usesSidebarAtDesktop = navigationVariant.md === 'sidebar';
  const usesCompactNavigation = Boolean(compactNavigation && !navigation?.loading);
  const scrollOffset = stickyHeader ? '10rem' : '6rem';
  const desktopScrollOffset = stickyHeader ? stickyHeaderOffset : '0px';
  const navigationStickyOffset =
    stickyHeader && navigation?.sticky ? stickyHeaderOffset : navigation?.stickyOffset;

  const navigationContent = navigation ? (
    navigation.loading ? (
      <ResourceFormNavigationSkeleton
        itemCount={navigation.items.length}
        sticky={navigationSupplement || usesCompactNavigation ? false : navigation.sticky}
        stickyOffset={navigationStickyOffset}
        variant={navigation.variant}
      />
    ) : (
      <ResourceFormNavigation
        {...navigation}
        sticky={navigationSupplement || usesCompactNavigation ? false : navigation.sticky}
        stickyOffset={navigationStickyOffset}
      />
    )
  ) : null;

  return (
    <div
      className={cn('flex min-w-0 flex-col gap-6', className)}
      data-slot="resource-form-route"
      style={
        {
          ...style,
          '--resource-form-scroll-offset': scrollOffset,
          '--resource-form-scroll-offset-md': desktopScrollOffset,
        } as React.CSSProperties
      }
      {...props}
    >
      {header ? (
        <div
          className={cn(stickyHeader && 'sticky top-0 z-20')}
          data-slot="resource-form-route-header"
        >
          {header}
        </div>
      ) : null}
      {navigation ? (
        <div
          className={cn(
            'flex min-w-0 flex-col gap-6',
            usesSidebarAtDesktop &&
              !usesCompactNavigation &&
              'md:grid md:grid-cols-[minmax(12rem,16rem)_minmax(0,1fr)] md:items-start',
            usesCompactNavigation &&
              'md:grid md:grid-cols-[2.5rem_minmax(0,1fr)] md:items-start lg:grid-cols-[minmax(12rem,16rem)_minmax(0,1fr)]'
          )}
        >
          {navigationSupplement || usesCompactNavigation ? (
            <div
              className={cn(
                'min-w-0',
                navigation.sticky &&
                  'sticky top-0 z-20 bg-background py-2 md:bg-transparent md:py-0'
              )}
              data-slot="resource-form-navigation-stack"
              style={navigation.sticky ? { top: navigationStickyOffset } : undefined}
            >
              {navigationContent}
              {usesCompactNavigation ? compactNavigation : null}
              <div
                className="mt-10 hidden lg:block lg:pl-5"
                data-slot="resource-form-navigation-supplement"
              >
                {navigationSupplement}
              </div>
            </div>
          ) : (
            navigationContent
          )}
          <div className="min-w-0">{children}</div>
        </div>
      ) : (
        children
      )}
      {footer ? (
        <div
          className={cn(stickyFooter && 'sticky bottom-0 z-20')}
          data-slot="resource-form-route-footer"
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}

export { ResourceFormRoute };
export type { ResourceFormRouteProps };
