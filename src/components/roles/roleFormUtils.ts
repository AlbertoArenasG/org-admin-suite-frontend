import type {
  RoleModuleCatalogItem,
  RoleOperationCatalogItem,
  RolePermission,
} from '@/features/roles/types';

export const READ_OPERATION_CODE = 'READ';

export type RolePermissionKey = `${string}:${string}`;

export function buildPermissionKey(moduleCode: string, operationCode: string): RolePermissionKey {
  return `${moduleCode}:${operationCode}`;
}

export function parsePermissionKey(key: RolePermissionKey): RolePermission {
  const [module, operation] = key.split(':');
  return { module, operation };
}

export function permissionsToSelection(permissions: RolePermission[]): Set<RolePermissionKey> {
  return new Set(
    permissions.map((permission) => buildPermissionKey(permission.module, permission.operation))
  );
}

export function selectionToPermissions(selection: Set<RolePermissionKey>): RolePermission[] {
  return Array.from(selection)
    .map(parsePermissionKey)
    .sort((a, b) =>
      a.module === b.module
        ? a.operation.localeCompare(b.operation)
        : a.module.localeCompare(b.module)
    );
}

export function togglePermissionSelection(params: {
  current: Set<RolePermissionKey>;
  moduleCode: string;
  operationCode: string;
}) {
  const next = new Set(params.current);
  const key = buildPermissionKey(params.moduleCode, params.operationCode);
  const readKey = buildPermissionKey(params.moduleCode, READ_OPERATION_CODE);
  const isActive = next.has(key);
  const isRead = params.operationCode === READ_OPERATION_CODE;

  if (isRead) {
    const hasNonReadActive = Array.from(next).some((entry) => {
      const permission = parsePermissionKey(entry);
      return (
        permission.module === params.moduleCode && permission.operation !== READ_OPERATION_CODE
      );
    });

    if (hasNonReadActive) {
      return next;
    }

    if (isActive) {
      next.delete(key);
    } else {
      next.add(key);
    }

    return next;
  }

  if (isActive) {
    next.delete(key);

    const stillHasNonReadActive = Array.from(next).some((entry) => {
      const permission = parsePermissionKey(entry);
      return (
        permission.module === params.moduleCode && permission.operation !== READ_OPERATION_CODE
      );
    });

    if (!stillHasNonReadActive) {
      next.delete(readKey);
    }

    return next;
  }

  next.add(key);
  next.add(readKey);
  return next;
}

export function buildPermissionCatalog(params: {
  modules: RoleModuleCatalogItem[];
  operations: RoleOperationCatalogItem[];
}) {
  const operations = [...params.operations].sort((a, b) => {
    const order = ['READ', 'CREATE', 'UPDATE', 'DELETE'];
    const aIndex = order.indexOf(a.operationCode);
    const bIndex = order.indexOf(b.operationCode);

    if (aIndex >= 0 || bIndex >= 0) {
      if (aIndex === -1) {
        return 1;
      }
      if (bIndex === -1) {
        return -1;
      }
      return aIndex - bIndex;
    }

    return a.operationCode.localeCompare(b.operationCode);
  });

  return params.modules
    .filter((module) => module.statusId === 'ACTIVE')
    .map((module) => ({
      ...module,
      operations: operations.filter((operation) => operation.statusId === 'ACTIVE'),
    }));
}
