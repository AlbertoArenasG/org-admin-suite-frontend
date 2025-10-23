'use client';

import type { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

/**
 * Central provider wrapper for shared context (Redux, theme, etc.).
 * Extend this component as new global providers are introduced.
 */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  );
}
