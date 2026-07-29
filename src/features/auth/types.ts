export const AUTH_SYSTEM_ROLES = ['MASTER_ADMIN', 'ADMIN', 'USER'] as const;

export type AuthSystemRole = (typeof AUTH_SYSTEM_ROLES)[number];

export interface AuthRoleMetadata {
  id: string;
  code: string;
  name: string;
  scope: string;
  isSystem: boolean;
  isDefault: boolean;
  isImmutable: boolean;
  status: string;
}

export interface AuthModuleAccess {
  code: string;
  name: string;
  nameKey: string;
}

export interface AuthPermissionAccess {
  module: string;
  moduleName: string;
  moduleNameKey: string;
  operation: string;
  operationName: string;
  operationNameKey: string;
}

export interface AuthAuthorization {
  role: AuthRoleMetadata | null;
  modules: AuthModuleAccess[];
  permissions: AuthPermissionAccess[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  lastname: string;
  systemRole: AuthSystemRole;
  roleId: string | null;
  status: string;
  cellPhone: {
    countryCode: string;
    number: string;
  } | null;
}
