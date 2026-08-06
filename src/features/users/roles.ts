import type { AuthSystemRole } from '@/features/auth/types';

const SYSTEM_ROLE_RANK: Record<AuthSystemRole, number> = {
  MASTER_ADMIN: 0,
  ADMIN: 1,
  USER: 2,
};

export function getSystemRoleFromRoleScope(roleScope: string | null | undefined): AuthSystemRole {
  switch ((roleScope ?? '').trim().toUpperCase()) {
    case 'MASTER_ADMIN':
      return 'MASTER_ADMIN';
    case 'ADMIN':
      return 'ADMIN';
    case 'USER':
    default:
      return 'USER';
  }
}

export function canInviteSystemRole(
  current: AuthSystemRole | null | undefined,
  target: AuthSystemRole | null | undefined
): boolean {
  if (!current || !target) {
    return false;
  }

  return SYSTEM_ROLE_RANK[current] < SYSTEM_ROLE_RANK[target];
}

type CanManageSystemRoleOptions = {
  allowSelf?: boolean;
  allowUserPeer?: boolean;
};

export function canManageSystemRole(
  current: AuthSystemRole | null | undefined,
  target: AuthSystemRole | null | undefined,
  options: CanManageSystemRoleOptions = {}
): boolean {
  if (!current || !target) {
    return false;
  }

  if (current === target) {
    if (options.allowSelf) {
      return true;
    }

    if (options.allowUserPeer && current === 'USER') {
      return true;
    }

    return false;
  }

  return SYSTEM_ROLE_RANK[current] < SYSTEM_ROLE_RANK[target];
}
