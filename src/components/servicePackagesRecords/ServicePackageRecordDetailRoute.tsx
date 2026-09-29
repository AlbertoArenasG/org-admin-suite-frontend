'use client';

import type { RefObject } from 'react';

import { ResourceFormRoute, type ResourceFormNavigationItem } from '@/components/resource-form';
import { ServicePackageRecordCompactNavigation } from './ServicePackageRecordCompactNavigation';

type ServicePackageRecordDetailRouteProps = {
  children: React.ReactNode;
  loading?: boolean;
  navigationItems: readonly ResourceFormNavigationItem[];
  navigationLabel: string;
  scrollContainerRef: RefObject<HTMLElement | null>;
};

export function ServicePackageRecordDetailRoute({
  children,
  loading = false,
  navigationItems,
  navigationLabel,
  scrollContainerRef,
}: ServicePackageRecordDetailRouteProps) {
  return (
    <ResourceFormRoute
      className="mx-auto w-full max-w-[90rem]"
      compactNavigation={
        <ServicePackageRecordCompactNavigation
          ariaLabel={navigationLabel}
          items={navigationItems}
          scrollContainerRef={scrollContainerRef}
        />
      }
      navigation={{
        ariaLabel: navigationLabel,
        className: 'md:hidden lg:flex',
        items: navigationItems,
        loading,
        scrollContainerRef,
        sticky: true,
        variant: { base: 'tabs', md: 'sidebar' },
      }}
    >
      <div className="space-y-5">{children}</div>
    </ResourceFormRoute>
  );
}
