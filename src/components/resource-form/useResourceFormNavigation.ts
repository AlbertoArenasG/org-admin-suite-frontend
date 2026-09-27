'use client';

import * as React from 'react';

const ACTIVATION_OFFSET = 112;

type ResourceFormNavigationTarget = {
  id: string;
};

type UseResourceFormNavigationOptions = {
  items: readonly ResourceFormNavigationTarget[];
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
};

function useResourceFormNavigation({
  items,
  scrollContainerRef,
}: UseResourceFormNavigationOptions) {
  const pendingNavigationIdRef = React.useRef<string | null>(null);
  const [activeId, setActiveId] = React.useState(items[0]?.id);

  React.useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((target): target is HTMLElement => target !== null);
    const container = scrollContainerRef?.current ?? null;

    if (targets.length === 0) return;

    const updateActiveItem = () => {
      const containerOwnsScroll = isScrollContainer(container);
      const referenceTop = containerOwnsScroll ? container.getBoundingClientRect().top : 0;
      const pendingId = pendingNavigationIdRef.current;

      if (pendingId) {
        const pendingTarget = targets.find((target) => target.id === pendingId);

        if (pendingTarget) {
          if (pendingTarget.getBoundingClientRect().top > referenceTop + ACTIVATION_OFFSET) return;

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

    updateActiveItem();
    container?.addEventListener('scroll', updateActiveItem, { passive: true });
    window.addEventListener('scroll', updateActiveItem, { passive: true });
    window.addEventListener('resize', updateActiveItem);

    return () => {
      container?.removeEventListener('scroll', updateActiveItem);
      window.removeEventListener('scroll', updateActiveItem);
      window.removeEventListener('resize', updateActiveItem);
    };
  }, [items, scrollContainerRef]);

  const navigate = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    pendingNavigationIdRef.current = id;
    setActiveId(id);

    const container = scrollContainerRef?.current ?? null;
    if (isScrollContainer(container)) {
      const targetMargin = Number.parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0;
      const targetTop =
        container.scrollTop +
        target.getBoundingClientRect().top -
        container.getBoundingClientRect().top -
        targetMargin;

      container.scrollTo({ behavior: 'smooth', top: Math.max(0, targetTop) });
      return;
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return { activeId, navigate };
}

function isScrollContainer(container: HTMLElement | null): container is HTMLElement {
  if (!container) return false;

  const overflowY = window.getComputedStyle(container).overflowY;
  return (
    container.scrollHeight > container.clientHeight &&
    ['auto', 'scroll', 'overlay'].includes(overflowY)
  );
}

export { useResourceFormNavigation };
export type { ResourceFormNavigationTarget, UseResourceFormNavigationOptions };
