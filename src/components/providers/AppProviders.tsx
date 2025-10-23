'use client';

import { Provider } from 'react-redux';
import type { PropsWithChildren } from 'react';
import { store } from '@/store/store';

/**
 * Central provider wrapper for shared context (Redux, theme, etc.).
 * Extend this component as new global providers are introduced.
 */
export function AppProviders({ children }: PropsWithChildren) {
  return <Provider store={store}>{children}</Provider>;
}
