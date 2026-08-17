'use client';

import { useMemo } from 'react';

import type { ExpirationStatusPoliciesTableRow } from '@/components/expiration-status-policies/types';
import type { ExpirationStatusPolicyListItem } from '@/features/expiration-status-policies/types';

export function useExpirationStatusPoliciesTableData(items: ExpirationStatusPolicyListItem[]) {
  return useMemo<ExpirationStatusPoliciesTableRow[]>(
    () =>
      items.map((item) => ({
        expirationStatusPolicyId: item.expirationStatusPolicyId,
        name: item.name,
        description: item.description,
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
