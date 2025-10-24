import type { UserRole } from '@/features/users/roles';

export interface UsersTableUser {
  id: string;
  fullName: string;
  email: string;
  roleName: string;
  roleId: UserRole;
  status: string;
  statusName: string;
  createdAt: string;
}
