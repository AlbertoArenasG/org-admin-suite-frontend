'use client';

import { useEffect } from 'react';

import { logout } from '@/features/auth/authSlice';
import { AUTH_TOKEN_STORAGE_KEY, readPersistedAuthToken } from '@/features/auth/persistence';
import { getTokenExpiryMs } from '@/features/auth/tokenExpiry';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';

export function AuthSessionMonitor() {
  const dispatch = useAppDispatch();
  const { hydrated, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!hydrated || !token) return;

    let expiryTimer: number | undefined;
    const expiresAt = getTokenExpiryMs(token);
    const checkSession = () => {
      window.clearTimeout(expiryTimer);
      const persistedToken = readPersistedAuthToken();
      if (persistedToken && persistedToken !== token) {
        window.location.reload();
        return;
      }
      if (!persistedToken || (expiresAt !== null && Date.now() >= expiresAt)) {
        dispatch(logout());
        return;
      }

      if (expiresAt !== null) {
        expiryTimer = window.setTimeout(
          checkSession,
          Math.min(expiresAt - Date.now(), 2_147_483_647)
        );
      }
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') checkSession();
    };
    const onStorageChange = (event: StorageEvent) => {
      if (event.key === AUTH_TOKEN_STORAGE_KEY && event.newValue !== token) checkSession();
    };

    checkSession();
    window.addEventListener('focus', checkSession);
    window.addEventListener('pageshow', checkSession);
    window.addEventListener('storage', onStorageChange);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.clearTimeout(expiryTimer);
      window.removeEventListener('focus', checkSession);
      window.removeEventListener('pageshow', checkSession);
      window.removeEventListener('storage', onStorageChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [dispatch, hydrated, token]);

  return null;
}
