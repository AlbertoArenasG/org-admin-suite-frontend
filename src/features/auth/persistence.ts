import type { AppDispatch } from '@/store';
import { markHydrated, setAuthToken } from './authSlice';

const AUTH_STORAGE_KEY = 'auth-token';

export function persistAuthToken(token: string | null) {
  if (token) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function hydrateAuthFromStorage(dispatch: AppDispatch) {
  const storedToken = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (storedToken) {
    dispatch(setAuthToken(storedToken));
  }

  dispatch(markHydrated(true));
}
