'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { hasModule as hasModuleHelper, hasPermission as hasPermissionHelper } from './helpers';
import {
  selectAuthAuthorization,
  selectAuthModules,
  selectAuthPermissions,
  selectHasAuthorizationLoaded,
} from './selectors';

export function useAuthorization() {
  const authorization = useAppSelector(selectAuthAuthorization);
  const modules = useAppSelector(selectAuthModules);
  const permissions = useAppSelector(selectAuthPermissions);
  const isReady = useAppSelector(selectHasAuthorizationLoaded);

  return useMemo(
    () => ({
      authorization,
      hasModule: (code: string) => hasModuleHelper(modules, code),
      hasPermission: (module: string, operation: string) =>
        hasPermissionHelper(permissions, module, operation),
      isReady,
    }),
    [authorization, isReady, modules, permissions]
  );
}
