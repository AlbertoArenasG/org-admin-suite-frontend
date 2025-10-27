export const USER_ROLES = ['MASTER_ADMIN', 'MASTER_STAFF', 'ADMIN', 'STAFF', 'CUSTOMER'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ROLE_RANK: Record<UserRole, number> = {
  MASTER_ADMIN: 0,
  MASTER_STAFF: 1,
  ADMIN: 2,
  STAFF: 3,
  CUSTOMER: 4,
};

export function parseUserRole(role: string | null | undefined): UserRole {
  if (!role) {
    return 'STAFF';
  }
  const normalized = role.trim().toUpperCase();
  if ((USER_ROLES as readonly string[]).includes(normalized)) {
    return normalized as UserRole;
  }
  return 'STAFF';
}

export function canInviteRole(current: UserRole | null | undefined, target: UserRole): boolean {
  if (!current) {
    return false;
  }
  // A user can invite roles at their same level or lower in hierarchy.
  return ROLE_RANK[current] <= ROLE_RANK[target];
}

type CanManageRoleOptions = {
  allowSameLevel?: boolean;
};

export function canManageRole(
  current: UserRole | null | undefined,
  target: UserRole | null | undefined,
  options: CanManageRoleOptions = {}
): boolean {
  if (!current || !target) {
    return false;
  }
  if (options.allowSameLevel) {
    return ROLE_RANK[current] <= ROLE_RANK[target];
  }
  if (target === 'ADMIN' && !['MASTER_ADMIN', 'MASTER_STAFF'].includes(current)) {
    return false;
  }
  return ROLE_RANK[current] < ROLE_RANK[target];
}

export const USER_ROLE_LIST: UserRole[] = [...USER_ROLES];
