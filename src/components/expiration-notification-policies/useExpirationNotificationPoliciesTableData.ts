'use client';

import { useMemo } from 'react';

import type { ExpirationNotificationPoliciesTableRow } from '@/components/expiration-notification-policies/types';
import type { ExpirationNotificationPolicyListItem } from '@/features/expiration-notification-policies/types';

export function useExpirationNotificationPoliciesTableData(
  items: ExpirationNotificationPolicyListItem[]
) {
  return useMemo<ExpirationNotificationPoliciesTableRow[]>(
    () =>
      items.map((item) => ({
        expirationNotificationPolicyId: item.expirationNotificationPolicyId,
        name: item.name,
        statusId: item.statusId,
        statusLabel: item.statusName,
        rulesCount: item.rulesCount,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        source: item,
      })),
    [items]
  );
}
