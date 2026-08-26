'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Tailspin } from 'ldrs/react';

const MIN_VISIBLE_TIME_MS = 360;
const COMPLETION_TIME_MS = 180;
const FAILSAFE_TIME_MS = 10_000;
const OVERLAY_DELAY_MS = 220;
const MIN_OVERLAY_VISIBLE_TIME_MS = 250;

export function RouteChangeLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams?.toString() ?? ''}`;
  const [visible, setVisible] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const isInitialRender = useRef(true);
  const isNavigating = useRef(false);
  const startedAt = useRef(0);
  const overlayShownAt = useRef(0);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  const beginNavigation = useCallback(() => {
    if (isNavigating.current) return;

    clearTimers();
    isNavigating.current = true;
    startedAt.current = Date.now();
    overlayShownAt.current = 0;
    setVisible(true);
    setProgress(12);

    timers.current.push(window.setTimeout(() => setProgress(58), 120));
    timers.current.push(
      window.setTimeout(() => {
        overlayShownAt.current = Date.now();
        setOverlayVisible(true);
      }, OVERLAY_DELAY_MS)
    );
    timers.current.push(window.setTimeout(() => setProgress(82), 520));
    timers.current.push(
      window.setTimeout(() => {
        isNavigating.current = false;
        overlayShownAt.current = 0;
        setOverlayVisible(false);
        setVisible(false);
      }, FAILSAFE_TIME_MS)
    );
  }, [clearTimers]);

  const finishNavigation = useCallback(() => {
    if (!isNavigating.current) return;

    clearTimers();
    const remainingVisibleTime = Math.max(
      0,
      MIN_VISIBLE_TIME_MS - (Date.now() - startedAt.current)
    );
    const remainingOverlayTime = overlayShownAt.current
      ? Math.max(0, MIN_OVERLAY_VISIBLE_TIME_MS - (Date.now() - overlayShownAt.current))
      : 0;
    setProgress(100);

    timers.current.push(
      window.setTimeout(
        () => {
          isNavigating.current = false;
          overlayShownAt.current = 0;
          setOverlayVisible(false);
          setVisible(false);
        },
        Math.max(remainingVisibleTime + COMPLETION_TIME_MS, remainingOverlayTime)
      )
    );
  }, [clearTimers]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = (event.target as Element | null)?.closest('a[href]') as HTMLAnchorElement | null;
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

      const destination = new URL(link.href, window.location.href);
      const current = new URL(window.location.href);
      const isSameLocation =
        destination.origin === current.origin &&
        destination.pathname === current.pathname &&
        destination.search === current.search;

      if (destination.origin === current.origin && !isSameLocation) {
        beginNavigation();
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [beginNavigation]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    finishNavigation();
  }, [finishNavigation, routeKey]);

  useEffect(() => clearTimers, [clearTimers]);

  return (
    <>
      {visible ? (
        <span
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-1 bg-primary/10"
        >
          <span
            className="block h-full bg-primary shadow-[0_0_12px_var(--primary-400)] transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </span>
      ) : null}

      <AnimatePresence>
        {overlayVisible ? (
          <motion.div
            animate={{ opacity: 1 }}
            aria-label="Cargando contenido"
            className="fixed inset-0 z-[9998] flex items-center justify-center bg-background/25 p-6 backdrop-blur-[1.5px]"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            role="status"
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="flex size-20 items-center justify-center rounded-[1.5rem] border border-border/70 bg-card/95 shadow-[0_18px_48px_rgba(15,23,42,0.18)]"
              exit={{ opacity: 0, scale: 0.94, y: 8 }}
              initial={{ opacity: 0, scale: 0.94, y: 8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <Tailspin color="var(--primary-500)" size="34" speed="0.9" stroke="3" />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
