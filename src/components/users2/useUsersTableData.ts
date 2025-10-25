'use client';

import { useMemo } from 'react';
import type { UsersTableUser } from '@/components/users2/types';
import type { User } from '@/features/users/usersSlice';
import { parseUserRole } from '@/features/users/roles';

export function useUsersTableData(users: User[]): UsersTableUser[] {
  return useMemo<UsersTableUser[]>(
    () =>
      users.map((user) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        roleName: user.roleName,
        roleId: parseUserRole(user.role),
        status: user.status,
        statusName: user.statusName,
        createdAt: user.createdAt,
      })),
    [users]
  );
}
