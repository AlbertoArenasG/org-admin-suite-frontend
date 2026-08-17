'use client';

import { useMemo } from 'react';
import type { TFunction } from 'i18next';
import type { InternalAssetMaintenanceRecordListItem } from '@/features/internal-asset-control/types';
import type { InternalAssetControlTableRow } from '@/components/internal-asset-control/types';

type Translate = TFunction<'internalAssetControl', undefined>;

export function useInternalAssetControlTableData(
  items: InternalAssetMaintenanceRecordListItem[],
  t: Translate
) {
  return useMemo<InternalAssetControlTableRow[]>(
    () =>
      items.map((item) => {
        const canShowDerivedStatus = item.statusId === 'PENDING' || item.statusId === 'IN_PROGRESS';

        return {
          internalAssetMaintenanceRecordId: item.internalAssetMaintenanceRecordId,
          assetName: item.assetName,
          assetIdentifier: item.assetIdentifier,
          assetMaintenanceTypeCode: item.assetMaintenanceType.code,
          assetMaintenanceTypeLabel: item.assetMaintenanceType.name,
          statusId: item.statusId,
          statusLabel: item.statusName,
          derivedStatusCode: item.derivedStatus.code,
          derivedStatusLabel: canShowDerivedStatus
            ? item.derivedStatus.name
            : t('labels.notApplicable'),
          derivedStatusColorHex: canShowDerivedStatus ? item.derivedStatus.colorHex : '#94a3b8',
          derivedStatusSource: item.derivedStatus.source,
          expirationDate: item.expirationDate,
          providerLabel: item.providerName ?? t('labels.providerNotSent'),
          sentToProvider: item.sentToProvider,
          updatedAt: item.updatedAt,
          source: item,
        };
      }),
    [items, t]
  );
}
