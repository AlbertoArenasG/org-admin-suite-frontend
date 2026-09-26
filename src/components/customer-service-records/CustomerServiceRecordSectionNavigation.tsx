'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

export type CustomerServiceRecordSectionNavigationItem = {
  id: string;
  label: string;
};

type CustomerServiceRecordSectionNavigationProps = {
  ariaLabel: string;
  items: readonly CustomerServiceRecordSectionNavigationItem[];
};

export function CustomerServiceRecordSectionNavigation({
  ariaLabel,
  items,
}: CustomerServiceRecordSectionNavigationProps) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((target): target is HTMLElement => target !== null);
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: 0 }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label={ariaLabel}
      className="sticky top-0 z-20 flex min-w-0 gap-1 overflow-x-auto border-b border-border bg-background py-2"
    >
      {items.map((item) => {
        const isActive = item.id === activeId;

        return (
          <a
            aria-current={isActive ? 'location' : undefined}
            className={cn(
              'min-w-max rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
            href={`#${item.id}`}
            key={item.id}
            onClick={(event) => {
              event.preventDefault();
              const target = document.getElementById(item.id);
              if (!target) return;

              setActiveId(item.id);
              target.focus({ preventScroll: true });
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
