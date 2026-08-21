import type { RoleModuleCatalogItem, RolePermission } from '@/features/roles/types';

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

export function buildValidPermissionKeySet(
  modules: RoleModuleCatalogItem[]
): Set<RolePermissionKey> {
  return new Set(
    modules.flatMap((module) =>
      module.statusId === 'ACTIVE'
        ? module.operations
            .filter((operation) => operation.statusId === 'ACTIVE')
            .map((operation) => buildPermissionKey(module.moduleCode, operation.operationCode))
        : []
    )
  );
}

export function sanitizeSelection(
  selection: Set<RolePermissionKey>,
  modules: RoleModuleCatalogItem[]
): Set<RolePermissionKey> {
  const validKeys = buildValidPermissionKeySet(modules);
  return new Set(Array.from(selection).filter((key) => validKeys.has(key)));
}

export function selectionToPermissions(
  selection: Set<RolePermissionKey>,
  modules?: RoleModuleCatalogItem[]
): RolePermission[] {
  const safeSelection = modules ? sanitizeSelection(selection, modules) : selection;

  return Array.from(safeSelection)
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
  hasReadOperation?: boolean;
}) {
  const next = new Set(params.current);
  const key = buildPermissionKey(params.moduleCode, params.operationCode);
  const readKey = buildPermissionKey(params.moduleCode, READ_OPERATION_CODE);
  const hasReadOperation = params.hasReadOperation ?? true;
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

    if (hasReadOperation && !stillHasNonReadActive) {
      next.delete(readKey);
    }

    return next;
  }

  next.add(key);
  if (hasReadOperation) {
    next.add(readKey);
  }
  return next;
}

export function toggleModulePermissionSelection(params: {
  current: Set<RolePermissionKey>;
  moduleCode: string;
  operationCodes: string[];
}) {
  const next = new Set(params.current);
  const moduleKeys = params.operationCodes.map((operationCode) =>
    buildPermissionKey(params.moduleCode, operationCode)
  );
  const allSelected = moduleKeys.every((key) => next.has(key));

  for (const key of moduleKeys) {
    if (allSelected) {
      next.delete(key);
    } else {
      next.add(key);
    }
  }

  return next;
}

export function buildPermissionCatalog(params: { modules: RoleModuleCatalogItem[] }) {
  return params.modules
    .filter((module) => module.statusId === 'ACTIVE')
    .map((module) => ({
      ...module,
      operations: module.operations.filter((operation) => operation.statusId === 'ACTIVE'),
    }));
}
