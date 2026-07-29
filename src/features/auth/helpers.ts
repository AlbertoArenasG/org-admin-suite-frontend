import type { AuthModuleAccess, AuthPermissionAccess } from './types';

export function buildPermissionKey(moduleCode: string, operationCode: string): string {
  return `${moduleCode}:${operationCode}`;
}

export function hasModule(
  modules: AuthModuleAccess[] | null | undefined,
  moduleCode: string
): boolean {
  if (!modules?.length) {
    return false;
  }

  return modules.some((module) => module.code === moduleCode);
}

export function hasPermission(
  permissions: AuthPermissionAccess[] | null | undefined,
  moduleCode: string,
  operationCode: string
): boolean {
  if (!permissions?.length) {
    return false;
  }

  const key = buildPermissionKey(moduleCode, operationCode);

  return permissions.some(
    (permission) => buildPermissionKey(permission.module, permission.operation) === key
  );
}
