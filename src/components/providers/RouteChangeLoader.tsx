'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { FullScreenLoader } from '@/components/ui/full-screen-loader';

const MIN_VISIBLE_TIME_MS = 400;

export function RouteChangeLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams?.toString() ?? '';
  const [visible, setVisible] = useState(false);

  const isInitialRender = useRef(true);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    setVisible(true);

    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
    }

    hideTimerRef.current = window.setTimeout(() => {
      setVisible(false);
      hideTimerRef.current = null;
    }, MIN_VISIBLE_TIME_MS);

    return () => {
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [pathname, searchKey]);

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

  return <FullScreenLoader text="" />;
}
