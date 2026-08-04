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
  const moduleNameByCode = new Map(
    params.modules.map((module) => [module.moduleCode, module.moduleName])
  );
  const operationNameByCode = new Map(
    params.modules.flatMap((module) =>
      module.operations.map(
        (operation) => [operation.operationCode, operation.operationName] as const
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

    bucket.operations.push({
      operationCode: permission.operation,
      operationName: operationNameByCode.get(permission.operation) ?? permission.operation,
    });

    buckets.set(permission.module, bucket);
  });

  return Array.from(buckets.values())
    .map((group) => ({
      ...group,
      operations: [...group.operations].sort((a, b) =>
        a.operationCode.localeCompare(b.operationCode)
      ),
    }))
    .sort((a, b) => a.moduleName.localeCompare(b.moduleName));
}
