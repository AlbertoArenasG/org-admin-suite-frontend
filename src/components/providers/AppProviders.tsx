'use client';

import { useEffect, type PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { I18nextProvider } from 'react-i18next';
import { initI18n, LANGUAGE_STORAGE_KEY } from '@/lib/i18n';

const i18n = initI18n();

/**
 * Central provider wrapper for shared context (Redux, theme, etc.).
 * Extend this component as new global providers are introduced.
 */
export function AppProviders({ children }: PropsWithChildren) {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && storedLanguage !== i18n.language) {
      void i18n.changeLanguage(storedLanguage);
    }

    const handleLanguageChange = (lng: string) => {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Provider store={store}>{children}</Provider>
      </ThemeProvider>
    </I18nextProvider>
  );
}
