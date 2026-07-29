import type { RootState } from '@/store';
import { buildPermissionKey } from './helpers';

export function selectAuthUser(state: RootState) {
  return state.auth.user;
}

export function selectAuthAuthorization(state: RootState) {
  return state.auth.authorization;
}

export function selectAuthModules(state: RootState) {
  return state.auth.authorization?.modules ?? [];
}

export function selectAuthPermissions(state: RootState) {
  return state.auth.authorization?.permissions ?? [];
}

export function selectAuthStatus(state: RootState) {
  return state.auth.status;
}

export function selectIsAuthHydrated(state: RootState) {
  return state.auth.hydrated;
}

export function selectHasAuthorizationLoaded(state: RootState) {
  return state.auth.authorization !== null;
}

export function selectModuleCodesSet(state: RootState) {
  return new Set(selectAuthModules(state).map((module) => module.code));
}

export function selectPermissionKeysSet(state: RootState) {
  return new Set(
    selectAuthPermissions(state).map((permission) =>
      buildPermissionKey(permission.module, permission.operation)
    )
  );
}
