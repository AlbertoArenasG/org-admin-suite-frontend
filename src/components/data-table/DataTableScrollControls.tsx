'use client';

import { useLayoutEffect, useState, type ReactNode, type RefObject } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';

type ScrollState = {
  hasHorizontalOverflow: boolean;
  hasVerticalOverflow: boolean;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  canScrollUp: boolean;
  canScrollDown: boolean;
};

type DataTableScrollControlsProps = {
  scrollViewportRef: RefObject<HTMLDivElement | null>;
};

const initialScrollState: ScrollState = {
  hasHorizontalOverflow: false,
  hasVerticalOverflow: false,
  canScrollLeft: false,
  canScrollRight: false,
  canScrollUp: false,
  canScrollDown: false,
};

function getScrollState(viewport: HTMLDivElement): ScrollState {
  const hasHorizontalOverflow = viewport.scrollWidth > viewport.clientWidth + 1;
  const hasVerticalOverflow = viewport.scrollHeight > viewport.clientHeight + 1;
  const maxHorizontalScroll = viewport.scrollWidth - viewport.clientWidth;
  const maxVerticalScroll = viewport.scrollHeight - viewport.clientHeight;

  return {
    hasHorizontalOverflow,
    hasVerticalOverflow,
    canScrollLeft: hasHorizontalOverflow && viewport.scrollLeft > 1,
    canScrollRight: hasHorizontalOverflow && viewport.scrollLeft < maxHorizontalScroll - 1,
    canScrollUp: hasVerticalOverflow && viewport.scrollTop > 1,
    canScrollDown: hasVerticalOverflow && viewport.scrollTop < maxVerticalScroll - 1,
  };
}

export function DataTableScrollControls({ scrollViewportRef }: DataTableScrollControlsProps) {
  const [scrollState, setScrollState] = useState(initialScrollState);

  useLayoutEffect(() => {
    const viewport = scrollViewportRef.current;
    if (!viewport) return;

    const updateScrollState = () => {
      const next = getScrollState(viewport);
      setScrollState((current) =>
        current.hasHorizontalOverflow === next.hasHorizontalOverflow &&
        current.hasVerticalOverflow === next.hasVerticalOverflow &&
        current.canScrollLeft === next.canScrollLeft &&
        current.canScrollRight === next.canScrollRight &&
        current.canScrollUp === next.canScrollUp &&
        current.canScrollDown === next.canScrollDown
          ? current
          : next
      );
    };

    updateScrollState();
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(viewport);
    if (viewport.firstElementChild) observer.observe(viewport.firstElementChild);
    viewport.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      observer.disconnect();
      viewport.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [scrollViewportRef]);

  const scrollBy = (left: number, top: number) => {
    scrollViewportRef.current?.scrollBy({ left, top, behavior: 'smooth' });
  };
  const horizontalStep = () => Math.max(240, (scrollViewportRef.current?.clientWidth ?? 0) * 0.8);
  const verticalStep = () => Math.max(240, (scrollViewportRef.current?.clientHeight ?? 0) * 0.8);

  return (
    <>
      {scrollState.hasVerticalOverflow ? (
        <div
          className={`pointer-events-none absolute right-0 top-0 z-20 hidden w-6 flex-col justify-between md:flex ${scrollState.hasHorizontalOverflow ? 'bottom-6' : 'bottom-0'}`}
          data-axis="y"
        >
          <ScrollControlButton
            ariaLabel="Desplazar tabla hacia arriba"
            disabled={!scrollState.canScrollUp}
            onClick={() => scrollBy(0, -verticalStep())}
          >
            <ChevronUp />
          </ScrollControlButton>
          <ScrollControlButton
            ariaLabel="Desplazar tabla hacia abajo"
            disabled={!scrollState.canScrollDown}
            onClick={() => scrollBy(0, verticalStep())}
          >
            <ChevronDown />
          </ScrollControlButton>
        </div>
      ) : null}
      {scrollState.hasHorizontalOverflow ? (
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 hidden h-6 items-center justify-between md:flex"
          data-axis="x"
        >
          <ScrollControlButton
            ariaLabel="Desplazar tabla a la izquierda"
            disabled={!scrollState.canScrollLeft}
            onClick={() => scrollBy(-horizontalStep(), 0)}
          >
            <ChevronLeft />
          </ScrollControlButton>
          <ScrollControlButton
            ariaLabel="Desplazar tabla a la derecha"
            disabled={!scrollState.canScrollRight}
            onClick={() => scrollBy(horizontalStep(), 0)}
          >
            <ChevronRight />
          </ScrollControlButton>
        </div>
      ) : null}
    </>
  );
}

type ScrollControlButtonProps = {
  ariaLabel: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
};

function ScrollControlButton({ ariaLabel, disabled, onClick, children }: ScrollControlButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className="pointer-events-auto inline-flex size-6 cursor-pointer items-center justify-center rounded-md border border-border bg-card text-foreground shadow-md transition-colors hover:bg-muted disabled:cursor-default disabled:opacity-40"
    >
      <span className="size-4 [&>svg]:size-4">{children}</span>
    </button>
  );
}
