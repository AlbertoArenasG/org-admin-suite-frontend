'use client';

import { useEffect, useState } from 'react';
import type { TOptions } from 'i18next';
import { useTranslation } from 'react-i18next';

export function useTranslationHydrated(namespace?: Parameters<typeof useTranslation>[0]) {
  const translation = useTranslation(namespace);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const safeT: typeof translation.t = (...args) => {
    if (hydrated) {
      return translation.t(...args);
    }

    const key = args[0];
    const options = (args[1] ?? {}) as TOptions;
    const defaultValue = options.defaultValue ?? (typeof key === 'string' ? key : '');
    return defaultValue;
  };

  return { ...translation, t: safeT, hydrated } as typeof translation & {
    t: typeof translation.t;
    hydrated: boolean;
  };
}
