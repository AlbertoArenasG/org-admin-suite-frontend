'use client';

import { useMemo } from 'react';
import type { RecipientGroupListItem } from '@/features/recipient-groups/types';
import type { RecipientGroupsTableRow } from '@/components/recipient-groups/types';

export function useRecipientGroupsTableData(items: RecipientGroupListItem[]) {
  return useMemo<RecipientGroupsTableRow[]>(
    () =>
      items.map((item) => ({
        recipientGroupId: item.recipientGroupId,
        name: item.name,
        code: item.code,
        description: item.description,
        enabledChannels: item.enabledChannels,
        channelsLabel: item.enabledChannels.map((channel) => channel.name).join(', '),
        contactsCount: item.contactsCount,
        statusId: item.statusId,
        statusLabel: item.statusName,
        createdAt: item.createdAt,
        source: item,
      })),
    [items]
  );
}
