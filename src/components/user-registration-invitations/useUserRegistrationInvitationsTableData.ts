'use client';

import { useMemo } from 'react';

import type { UserRegistrationInvitation } from '@/features/user-registration-invitations';
import type { UserRegistrationInvitationsTableRow } from './types';

export function useUserRegistrationInvitationsTableData(items: UserRegistrationInvitation[]) {
  return useMemo<UserRegistrationInvitationsTableRow[]>(
    () =>
      items.map((item) => ({
        invitationId: item.invitationId,
        email: item.email,
        roleLabel: item.roleName ?? '—',
        systemRoleLabel: item.systemRoleName,
        status: item.status,
        statusLabel: item.statusName,
        statusDate: item.status === 'CONSUMED' ? item.consumedAt : item.revokedAt,
        lastAttemptAt: item.emailDelivery.lastAttemptAt,
        lastAttemptStatus: item.emailDelivery.lastAttemptStatus,
        resendCount: item.resendCount,
        createdAt: item.createdAt,
        hasDeliveryFailure: item.emailDelivery.lastAttemptStatus === 'FAILED',
        source: item,
      })),
    [items]
  );
}
