'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const BAR_VISIBLE_TIME_MS = 600;

export function RouteChangeLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams?.toString() ?? '';
  const [visible, setVisible] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const isInitialRender = useRef(true);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    setAnimationKey((key) => key + 1);
    setVisible(true);

    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
    }

    hideTimerRef.current = window.setTimeout(() => {
      setVisible(false);
      hideTimerRef.current = null;
    }, BAR_VISIBLE_TIME_MS);

    return () => {
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [pathname, searchParamsString]);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <span
      key={animationKey}
      className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-1 overflow-hidden"
      aria-hidden
    >
      <span className="block h-full w-full animate-route-progress bg-primary" />
    </span>
  );
}
