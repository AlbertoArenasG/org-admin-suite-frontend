import i18n, { type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonEn from '@/locales/en/common.json';
import navEn from '@/locales/en/nav.json';
import breadcrumbsEn from '@/locales/en/breadcrumbs.json';
import dashboardEn from '@/locales/en/dashboard.json';
import customersEn from '@/locales/en/customers.json';
import providersEn from '@/locales/en/providers.json';
import usersEn from '@/locales/en/users.json';
import serviceEntriesEn from '@/locales/en/serviceEntries.json';
import publicServiceEntryEn from '@/locales/en/publicServiceEntry.json';
import serviceEntrySurveysEn from '@/locales/en/serviceEntrySurveys.json';
import servicePackagesRecordsEn from '@/locales/en/servicePackagesRecords.json';
import myProfileEn from '@/locales/en/myProfile.json';
import publicCustomerProfileEn from '@/locales/en/publicCustomerProfile.json';
import publicProviderProfileEn from '@/locales/en/publicProviderProfile.json';
import authEn from '@/locales/en/auth.json';
import commonEs from '@/locales/es/common.json';
import navEs from '@/locales/es/nav.json';
import breadcrumbsEs from '@/locales/es/breadcrumbs.json';
import dashboardEs from '@/locales/es/dashboard.json';
import customersEs from '@/locales/es/customers.json';
import providersEs from '@/locales/es/providers.json';
import usersEs from '@/locales/es/users.json';
import serviceEntriesEs from '@/locales/es/serviceEntries.json';
import publicServiceEntryEs from '@/locales/es/publicServiceEntry.json';
import serviceEntrySurveysEs from '@/locales/es/serviceEntrySurveys.json';
import servicePackagesRecordsEs from '@/locales/es/servicePackagesRecords.json';
import myProfileEs from '@/locales/es/myProfile.json';
import publicCustomerProfileEs from '@/locales/es/publicCustomerProfile.json';
import publicProviderProfileEs from '@/locales/es/publicProviderProfile.json';
import authEs from '@/locales/es/auth.json';

const FALLBACK_LANGUAGE = 'es';
export const LANGUAGE_STORAGE_KEY = 'preferred-language';

const resources = {
  en: {
    common: commonEn,
    auth: authEn,
    nav: navEn,
    breadcrumbs: breadcrumbsEn,
    dashboard: dashboardEn,
    customers: customersEn,
    providers: providersEn,
    users: usersEn,
    serviceEntries: serviceEntriesEn,
    publicServiceEntry: publicServiceEntryEn,
    serviceEntrySurveys: serviceEntrySurveysEn,
    servicePackagesRecords: servicePackagesRecordsEn,
    myProfile: myProfileEn,
    publicCustomerProfile: publicCustomerProfileEn,
    publicProviderProfile: publicProviderProfileEn,
  },
  es: {
    common: commonEs,
    auth: authEs,
    nav: navEs,
    breadcrumbs: breadcrumbsEs,
    dashboard: dashboardEs,
    customers: customersEs,
    providers: providersEs,
    users: usersEs,
    serviceEntries: serviceEntriesEs,
    publicServiceEntry: publicServiceEntryEs,
    serviceEntrySurveys: serviceEntrySurveysEs,
    servicePackagesRecords: servicePackagesRecordsEs,
    myProfile: myProfileEs,
    publicCustomerProfile: publicCustomerProfileEs,
    publicProviderProfile: publicProviderProfileEs,
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
      ns: [
        'common',
        'auth',
        'nav',
        'breadcrumbs',
        'dashboard',
        'customers',
        'providers',
        'users',
        'serviceEntries',
        'publicServiceEntry',
        'serviceEntrySurveys',
        'servicePackagesRecords',
        'myProfile',
        'publicCustomerProfile',
        'publicProviderProfile',
      ],
      defaultNS: 'common',
      interpolation: {
        escapeValue: false,
      },
      returnNull: false,
    });
  }

  return i18n;
}
