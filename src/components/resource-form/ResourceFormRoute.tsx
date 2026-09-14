import * as React from 'react';

import {
  ResourceFormNavigation,
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
  navigation?: {
    items: readonly ResourceFormNavigationItem[];
    variant?: ResourceFormResponsiveValue<ResourceFormNavigationVariant>;
    scrollContainerRef?: React.RefObject<HTMLElement | null>;
    ariaLabel?: string;
    className?: string;
    sticky?: boolean;
    stickyOffset?: string;
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
  footer,
  header,
  navigation,
  stickyFooter = false,
  stickyHeader = false,
  stickyHeaderOffset = '0px',
  style,
  ...props
}: ResourceFormRouteProps) {
  const navigationVariant = resolveResponsiveValue(navigation?.variant, 'tabs');
  const usesSidebarAtDesktop = navigationVariant.md === 'sidebar';
  const scrollOffset = stickyHeader ? '10rem' : '6rem';
  const desktopScrollOffset = stickyHeader ? stickyHeaderOffset : '0px';

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
              'md:grid md:grid-cols-[minmax(12rem,16rem)_minmax(0,1fr)] md:items-start'
          )}
        >
          <ResourceFormNavigation
            {...navigation}
            stickyOffset={
              stickyHeader && navigation.sticky ? stickyHeaderOffset : navigation.stickyOffset
            }
          />
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
