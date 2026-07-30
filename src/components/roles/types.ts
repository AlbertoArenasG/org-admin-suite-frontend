import type { RoleListItem, RoleScope, RoleStatusId } from '@/features/roles/types';

export interface RolesTableRow {
  roleId: string;
  name: string;
  code: string;
  scope: RoleScope;
  statusId: RoleStatusId;
  statusLabel: string;
  isSystem: boolean;
  isDefault: boolean;
  isImmutable: boolean;
  createdAt: string | null;
  source: RoleListItem;
}
