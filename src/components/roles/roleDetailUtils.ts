import type { RoleModuleCatalogItem, RolePermission } from '@/features/roles/types';

export interface RolePermissionGroup {
  moduleCode: string;
  moduleName: string;
  operations: Array<{
    operationCode: string;
    operationName: string;
  }>;
}

export function groupRolePermissions(params: {
  permissions: RolePermission[];
  modules: RoleModuleCatalogItem[];
}) {
  const moduleOrderByCode = new Map(
    params.modules.map((module, index) => [module.moduleCode, index] as const)
  );
  const moduleNameByCode = new Map(
    params.modules.map((module) => [module.moduleCode, module.moduleName])
  );
  const operationNameByKey = new Map(
    params.modules.flatMap((module) =>
      module.operations.map(
        (operation, index) =>
          [
            `${module.moduleCode}:${operation.operationCode}`,
            {
              name: operation.operationName,
              order: index,
            },
          ] as const
      )
    )
  );

  const buckets = new Map<string, RolePermissionGroup>();

  params.permissions.forEach((permission) => {
    const bucket =
      buckets.get(permission.module) ??
      ({
        moduleCode: permission.module,
        moduleName: moduleNameByCode.get(permission.module) ?? permission.module,
        operations: [],
      } satisfies RolePermissionGroup);
    const operationMetadata = operationNameByKey.get(
      `${permission.module}:${permission.operation}`
    );

    bucket.operations.push({
      operationCode: permission.operation,
      operationName: operationMetadata?.name ?? permission.operation,
    });

    buckets.set(permission.module, bucket);
  });

  return Array.from(buckets.values())
    .map((group) => ({
      ...group,
      operations: [...group.operations].sort(
        (a, b) =>
          (operationNameByKey.get(`${group.moduleCode}:${a.operationCode}`)?.order ??
            Number.MAX_SAFE_INTEGER) -
            (operationNameByKey.get(`${group.moduleCode}:${b.operationCode}`)?.order ??
              Number.MAX_SAFE_INTEGER) || a.operationCode.localeCompare(b.operationCode)
      ),
    }))
    .sort(
      (a, b) =>
        (moduleOrderByCode.get(a.moduleCode) ?? Number.MAX_SAFE_INTEGER) -
          (moduleOrderByCode.get(b.moduleCode) ?? Number.MAX_SAFE_INTEGER) ||
        a.moduleName.localeCompare(b.moduleName)
    );
}
