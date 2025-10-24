import type { AppDispatch } from '@/store';
import type { AuthUser } from './types';
import { markHydrated, setAuthSnapshot } from './authSlice';
import { fetchCurrentUser } from './authThunks';
import { parseUserRole } from '@/features/users/roles';

const AUTH_TOKEN_KEY = 'auth-token';
const AUTH_USER_KEY = 'auth-user';

export function persistAuthToken(token: string | null) {
  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
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

export function hydrateAuthFromStorage(dispatch: AppDispatch) {
  const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
  const rawUser = window.localStorage.getItem(AUTH_USER_KEY);

  let user: AuthUser | null = null;

  if (rawUser) {
    try {
      const parsed = JSON.parse(rawUser) as AuthUser;
      user = {
        ...parsed,
        role: parseUserRole(parsed.role as unknown as string),
      };
    } catch {
      window.localStorage.removeItem(AUTH_USER_KEY);
    }
  }

  if (token || user) {
    dispatch(setAuthSnapshot({ token: token ?? null, user }));

    if (token && !user) {
      void dispatch(fetchCurrentUser()).finally(() => {
        dispatch(markHydrated(true));
      });
      return;
    }
  }

  dispatch(markHydrated(true));
}
