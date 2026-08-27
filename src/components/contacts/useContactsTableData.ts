'use client';

import { useMemo } from 'react';
import type { ContactListItem } from '@/features/contacts/types';
import type { ContactsTableRow } from '@/components/contacts/types';

export function useContactsTableData(items: ContactListItem[]) {
  return useMemo<ContactsTableRow[]>(
    () =>
      items.map((item) => ({
        contactId: item.contactId,
        fullName: item.fullName,
        companyName: item.companyName,
        primaryEmail: item.primaryEmail,
        primaryCellPhone: item.primaryCellPhone,
        isInternalStaff: item.isInternalStaff,
        statusId: item.statusId,
        statusLabel: item.statusName,
        userId: item.userId,
        canMutate: !item.userId,
        createdAt: item.createdAt,
        source: item,
      })),
    [items]
  );
}
