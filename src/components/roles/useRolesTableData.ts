'use client';

import { useMemo } from 'react';
import type { TFunction } from 'i18next';
import type { RoleListItem } from '@/features/roles/types';
import type { RolesTableRow } from '@/components/roles/types';

type Translate = TFunction<'roles', undefined>;

export function useRolesTableData(items: RoleListItem[], t: Translate) {
  return useMemo<RolesTableRow[]>(
    () =>
      items.map((item) => ({
        roleId: item.roleId,
        name: item.name,
        code: item.code,
        scope: item.scope,
        statusId: item.statusId,
        statusLabel: t(`status.${item.statusId}`, { defaultValue: item.statusId }),
        isSystem: item.isSystem,
        isDefault: item.isDefault,
        isImmutable: item.isImmutable,
        createdAt: item.createdAt,
        source: item,
      })),
    [items, t]
  );
}
