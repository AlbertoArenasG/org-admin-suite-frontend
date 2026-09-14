'use client';

import * as React from 'react';

import {
  responsiveClasses,
  type ResourceFormResponsiveValue,
} from '@/components/resource-form/resource-form-presentation';
import { cn } from '@/lib/utils';

export type ResourceFormNavigationVariant = 'tabs' | 'sidebar';
const ACTIVATION_OFFSET = 112;

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

function ResourceFormNavigation({
  ariaLabel = 'Navegación del formulario',
  className,
  items,
  scrollContainerRef,
  sticky = false,
  stickyOffset = '0px',
  variant = { base: 'tabs', md: 'sidebar' },
}: ResourceFormNavigationProps) {
  const navigationRef = React.useRef<HTMLElement>(null);
  const pendingNavigationIdRef = React.useRef<string | null>(null);
  const [activeId, setActiveId] = React.useState(items[0]?.id);

  React.useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((target): target is HTMLElement => target !== null);
    const container = scrollContainerRef?.current;

    if (targets.length === 0) {
      return;
    }

    const updateActiveItem = () => {
      const referenceTop = container ? container.getBoundingClientRect().top : 0;
      const pendingId = pendingNavigationIdRef.current;

      if (pendingId) {
        const pendingTarget = targets.find((target) => target.id === pendingId);

        if (pendingTarget) {
          const pendingTop = pendingTarget.getBoundingClientRect().top;

          if (pendingTop > referenceTop + ACTIVATION_OFFSET) {
            return;
          }

          setActiveId(pendingId);
          pendingNavigationIdRef.current = null;
          return;
        }

        pendingNavigationIdRef.current = null;
      }

      const passed = targets.filter(
        (target) => target.getBoundingClientRect().top <= referenceTop + ACTIVATION_OFFSET
      );
      setActiveId((passed.at(-1) ?? targets[0]).id);
    };

    const scrollTarget: EventTarget = container ?? window;
    updateActiveItem();
    scrollTarget.addEventListener('scroll', updateActiveItem, { passive: true });
    window.addEventListener('resize', updateActiveItem);

    return () => {
      scrollTarget.removeEventListener('scroll', updateActiveItem);
      window.removeEventListener('resize', updateActiveItem);
    };
  }, [items, scrollContainerRef]);

  const navigationClasses = responsiveClasses(variant, 'tabs', {
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

  const handleNavigate = (id: string) => {
    const target = document.getElementById(id);

    if (!target) {
      return;
    }

    pendingNavigationIdRef.current = id;
    setActiveId(id);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      ref={navigationRef}
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

export { ResourceFormNavigation };
export type { ResourceFormNavigationProps };
