'use client';

import { useEffect, useState } from 'react';
import type { TFunction, TOptions } from 'i18next';
import { useTranslation } from 'react-i18next';

export function useTranslationHydrated(namespace?: Parameters<typeof useTranslation>[0]) {
  const translation = useTranslation(namespace);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const safeT: TFunction = ((...args: Parameters<TFunction>) => {
    if (hydrated) {
      return translation.t(...args);
    }

    const key = args[0];
    const options = (args[1] ?? {}) as TOptions;
    const defaultValue = options.defaultValue ?? (typeof key === 'string' ? key : '');
    return defaultValue;
  }) as TFunction;

  return { ...translation, t: safeT, hydrated };
}
