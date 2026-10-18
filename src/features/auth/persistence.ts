import type { AppDispatch } from '@/store';
import type { AuthUser } from './types';
import { logout, markHydrated, setAuthSnapshot } from './authSlice';
import { fetchCurrentUser, fetchMyPermissions } from './authThunks';
import { isTokenExpired } from './tokenExpiry';

export const AUTH_TOKEN_STORAGE_KEY = 'auth-token';
const AUTH_USER_KEY = 'auth-user';
let hydrationRunId = 0;

export function persistAuthToken(token: string | null) {
  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  }
}

export function persistAuthUser(user: AuthUser | null) {
  if (user) {
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(AUTH_USER_KEY);
  }
}

export function persistAuthSession(token: string | null, user: AuthUser | null) {
  persistAuthToken(token);
  persistAuthUser(user);
}

export async function hydrateAuthFromStorage(dispatch: AppDispatch) {
  const runId = ++hydrationRunId;
  const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  const rawUser = window.localStorage.getItem(AUTH_USER_KEY);

  if (token && isTokenExpired(token)) {
    dispatch(logout());
    return;
  }

  let user: AuthUser | null = null;

  if (rawUser) {
    try {
      user = JSON.parse(rawUser) as AuthUser;
    } catch {
      window.localStorage.removeItem(AUTH_USER_KEY);
    }
  }

  dispatch(markHydrated(false));
  dispatch(setAuthSnapshot({ token, user: token ? user : null }));

  if (!token) {
    if (rawUser) persistAuthUser(null);
    dispatch(markHydrated(true));
    return;
  }

  try {
    if (!user) {
      const result = await dispatch(fetchCurrentUser());
      if (runId !== hydrationRunId || !fetchCurrentUser.fulfilled.match(result)) return;
    }

    if (readPersistedAuthToken() !== token) return;
    await dispatch(fetchMyPermissions());
  } finally {
    if (runId === hydrationRunId) {
      if (readPersistedAuthToken() === token) {
        dispatch(markHydrated(true));
      } else {
        void hydrateAuthFromStorage(dispatch);
      }
    }
  }
}

export function readPersistedAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}
