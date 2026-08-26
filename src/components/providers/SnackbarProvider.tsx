'use client';

import { useEffect, type ReactNode } from 'react';
import { useTheme } from 'next-themes';
import { sileo, Toaster } from 'sileo';
import { useSnackbarStore } from '@/components/providers/useSnackbarStore';

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const open = useSnackbarStore((state) => state.open);
  const message = useSnackbarStore((state) => state.message);
  const severity = useSnackbarStore((state) => state.severity);
  const autoHideDuration = useSnackbarStore((state) => state.autoHideDuration);
  const hideSnackbar = useSnackbarStore((state) => state.hideSnackbar);

  useEffect(() => {
    if (!open || !message) return;

    sileo[severity]({
      autopilot: {
        collapse: Math.max(120, autoHideDuration - 650),
        expand: 120,
      },
      description: message,
      duration: autoHideDuration,
    });
    hideSnackbar();
  }, [autoHideDuration, hideSnackbar, message, open, severity]);

  useEffect(() => () => sileo.clear(), []);

  return (
    <>
      {children}
      <Toaster
        offset={{ top: 28 }}
        options={{ fill: 'var(--card-foreground)', roundness: 24 }}
        position="top-center"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      />
    </>
  );
}
