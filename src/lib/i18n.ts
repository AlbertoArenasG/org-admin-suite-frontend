import i18n, { type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonEn from '@/locales/en/common.json';
import authEn from '@/locales/en/auth.json';
import commonEs from '@/locales/es/common.json';
import authEs from '@/locales/es/auth.json';

const FALLBACK_LANGUAGE = 'es';
export const LANGUAGE_STORAGE_KEY = 'preferred-language';

const resources = {
  en: {
    common: commonEn,
    auth: authEn,
  },
  es: {
    common: commonEs,
    auth: authEs,
  },
};

function resolveInitialLanguage() {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && stored in resources) {
      return stored;
    }

    const htmlLang = document.documentElement.getAttribute('lang');
    if (htmlLang && htmlLang in resources) {
      return htmlLang;
    }
  }

  return FALLBACK_LANGUAGE;
}

export function initI18n(): I18nInstance {
  if (!i18n.isInitialized) {
    i18n.use(initReactI18next);
    void i18n.init({
      resources,
      fallbackLng: FALLBACK_LANGUAGE,
      lng: resolveInitialLanguage(),
      supportedLngs: Object.keys(resources),
      ns: ['common', 'auth'],
      defaultNS: 'common',
      interpolation: {
        escapeValue: false,
      },
      returnNull: false,
    });
  }

  return i18n;
}
