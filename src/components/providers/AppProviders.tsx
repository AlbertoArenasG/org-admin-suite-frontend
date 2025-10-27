'use client';

import { Suspense, useLayoutEffect, useEffect, type PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { I18nextProvider } from 'react-i18next';
import { initI18n, LANGUAGE_STORAGE_KEY } from '@/lib/i18n';
import { hydrateAuthFromStorage } from '@/features/auth/persistence';
import { SnackbarProvider } from '@/components/providers/SnackbarProvider';
import { RouteChangeLoader } from '@/components/providers/RouteChangeLoader';

const i18n = initI18n();

/**
 * Central provider wrapper for shared context (Redux, theme, etc.).
 * Extend this component as new global providers are introduced.
 */
export function AppProviders({ children }: PropsWithChildren) {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    hydrateAuthFromStorage(store.dispatch);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleLanguageChange = (lng: string) => {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
      document.documentElement.setAttribute('lang', lng);
    };

    handleLanguageChange(i18n.language);
    i18n.on('languageChanged', handleLanguageChange);

    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && storedLanguage !== i18n.language) {
      void i18n.changeLanguage(storedLanguage);
    }

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <Provider store={store}>
          <SnackbarProvider>
            <Suspense fallback={null}>
              <RouteChangeLoader />
            </Suspense>
            {children}
          </SnackbarProvider>
        </Provider>
      </ThemeProvider>
    </I18nextProvider>
  );
}
