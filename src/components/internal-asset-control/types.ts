'use client';

import type {
  InternalAssetMaintenanceRecordListItem,
  InternalAssetMaintenanceRecordStatusId,
  InternalAssetMaintenanceTypeId,
} from '@/features/internal-asset-control/types';

export interface InternalAssetControlTableRow {
  internalAssetMaintenanceRecordId: string;
  assetName: string;
  assetIdentifier: string;
  assetMaintenanceTypeCode: InternalAssetMaintenanceTypeId;
  assetMaintenanceTypeLabel: string;
  statusId: InternalAssetMaintenanceRecordStatusId;
  statusLabel: string;
  derivedStatusCode: string;
  derivedStatusLabel: string;
  derivedStatusColorHex: string;
  derivedStatusSource: 'POLICY' | 'SYSTEM';
  expirationDate: string;
  providerLabel: string;
  sentToProvider: boolean;
  updatedAt: string | null;
  source: InternalAssetMaintenanceRecordListItem;
}

export interface InternalAssetControlDeleteTarget {
  internalAssetMaintenanceRecordId: string;
  assetName: string;
  assetIdentifier: string;
}

export function buildInternalAssetControlDeleteTarget(
  row: Pick<
    InternalAssetControlTableRow,
    'internalAssetMaintenanceRecordId' | 'assetName' | 'assetIdentifier'
  >
): InternalAssetControlDeleteTarget {
  return {
    internalAssetMaintenanceRecordId: row.internalAssetMaintenanceRecordId,
    assetName: row.assetName,
    assetIdentifier: row.assetIdentifier,
  };
}
