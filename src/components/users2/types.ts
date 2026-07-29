import type { AuthSystemRole } from '@/features/auth/types';

export interface UsersTableUser {
  id: string;
  fullName: string;
  email: string;
  roleName: string;
  roleId: string | null;
  systemRole: AuthSystemRole;
  status: string;
  statusName: string;
  createdAt: string;
}
