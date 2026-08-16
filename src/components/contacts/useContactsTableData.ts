'use client';

import { useMemo } from 'react';
import type { TFunction } from 'i18next';
import type { ContactListItem } from '@/features/contacts/types';
import type { ContactsTableRow } from '@/components/contacts/types';

type Translate = TFunction<'contacts', undefined>;

export function useContactsTableData(items: ContactListItem[], t: Translate) {
  return useMemo<ContactsTableRow[]>(
    () =>
      items.map((item) => ({
        contactId: item.contactId,
        fullName: item.fullName,
        companyName: item.companyName,
        primaryEmail: item.primaryEmail,
        primaryCellPhone: item.primaryCellPhone,
        type: item.type,
        typeLabel: t(`types.${item.type}`, { defaultValue: item.type }),
        statusId: item.statusId,
        statusLabel: item.statusName,
        userId: item.userId,
        canMutate: !item.userId,
        createdAt: item.createdAt,
        source: item,
      })),
    [items, t]
  );
}
