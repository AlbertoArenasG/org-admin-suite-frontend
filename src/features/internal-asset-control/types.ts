export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
export type SortDirection = 'asc' | 'desc';

export type InternalAssetMaintenanceRecordStatusId =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DELETED';

export type InternalAssetMaintenanceTypeId =
  | 'CALIBRATION'
  | 'VERIFICATION'
  | 'PREVENTIVE_MAINTENANCE';

export type InternalAssetMaintenanceRecordSortField =
  | 'asset_name'
  | 'asset_identifier'
  | 'last_maintenance_at'
  | 'expiration_date'
  | 'status'
  | 'created_at';

export interface InternalAssetMaintenanceInterval {
  years: number;
  months: number;
  weeks: number;
  days: number;
}

export interface InternalAssetMaintenanceCatalogItem<TCode extends string = string> {
  code: TCode;
  name: string;
  nameKey: string;
}

export interface InternalAssetMaintenanceActorSummary {
  userId: string;
  name: string | null;
  email: string | null;
}

export interface InternalAssetMaintenancePolicySummary {
  id: string;
  name: string;
  code: string;
  statusId: string;
}

export interface InternalAssetMaintenanceRecipientGroupSummary {
  recipientGroupId: string;
  name: string;
  code: string;
  statusId: string;
  enabledChannels: Array<{
    code: string;
    name: string;
    nameKey: string;
  }>;
}

export interface InternalAssetMaintenanceDerivedStatus {
  code: string;
  name: string;
  nameKey: string | null;
  colorHex: string;
  source: 'POLICY' | 'SYSTEM';
}

export interface InternalAssetMaintenanceProviderFollowUpRule {
  offset: InternalAssetMaintenanceInterval;
  recipientGroupIds: string[];
  ccRecipientGroupIds: string[];
  recipientGroups: InternalAssetMaintenanceRecipientGroupSummary[];
  ccRecipientGroups: InternalAssetMaintenanceRecipientGroupSummary[];
}

export interface InternalAssetMaintenanceProviderFollowUpConfig {
  enabled: boolean;
  rules: InternalAssetMaintenanceProviderFollowUpRule[];
  lastSentAt: string | null;
}

export interface InternalAssetMaintenanceProvider {
  sentToProvider: boolean;
  providerName: string | null;
  sentToProviderAt: string | null;
  providerLeadTime: InternalAssetMaintenanceInterval | null;
  providerNotes: string | null;
}

export interface InternalAssetMaintenanceRecordListItem {
  internalAssetMaintenanceRecordId: string;
  assetName: string;
  assetIdentifier: string;
  assetMaintenanceType: {
    code: InternalAssetMaintenanceTypeId;
    name: string;
  };
  lastMaintenanceAt: string;
  expirationDate: string;
  statusId: InternalAssetMaintenanceRecordStatusId;
  statusName: string;
  derivedStatus: InternalAssetMaintenanceDerivedStatus;
  expirationStatusPolicy: InternalAssetMaintenancePolicySummary | null;
  expirationNotificationPolicy: InternalAssetMaintenancePolicySummary | null;
  sentToProvider: boolean;
  providerName: string | null;
  providerLeadTime: InternalAssetMaintenanceInterval | null;
  providerFollowUpEnabled: boolean;
  providerFollowUpRulesCount: number;
  providerFollowUpLastSentAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface InternalAssetMaintenanceRecordDetail
  extends InternalAssetMaintenanceRecordListItem {
  observations: string | null;
  provider: InternalAssetMaintenanceProvider | null;
  providerFollowUp: InternalAssetMaintenanceProviderFollowUpConfig | null;
  createdBy: InternalAssetMaintenanceActorSummary | null;
  updatedBy: InternalAssetMaintenanceActorSummary | null;
}

export interface InternalAssetMaintenanceCatalog {
  assetMaintenanceTypes: InternalAssetMaintenanceCatalogItem<InternalAssetMaintenanceTypeId>[];
  statuses: InternalAssetMaintenanceCatalogItem<InternalAssetMaintenanceRecordStatusId>[];
}

export interface InternalAssetMaintenanceRecordsListFilters {
  assetMaintenanceType: InternalAssetMaintenanceTypeId | null;
  status: InternalAssetMaintenanceRecordStatusId | null;
  expirationStatusPolicyId: string | null;
  expirationNotificationPolicyId: string | null;
  sentToProvider: boolean | null;
}

export interface InternalAssetMaintenanceRecordsListSort {
  field: InternalAssetMaintenanceRecordSortField;
  direction: SortDirection;
}

export interface FetchInternalAssetMaintenanceRecordsParams {
  page?: number;
  limit?: number;
  itemsPerPage?: number;
  search?: string | null;
  filters?: Partial<InternalAssetMaintenanceRecordsListFilters>;
  sorts?: InternalAssetMaintenanceRecordsListSort[];
}

export interface FetchInternalAssetMaintenanceRecordsResult {
  items: InternalAssetMaintenanceRecordListItem[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface InternalAssetMaintenanceRecordMutationPayload {
  assetName: string;
  assetIdentifier: string;
  assetMaintenanceType: InternalAssetMaintenanceTypeId;
  lastMaintenanceAt: string;
  interval: InternalAssetMaintenanceInterval;
  expirationDate: string | null;
  observations: string | null;
  statusId?: InternalAssetMaintenanceRecordStatusId | null;
  expirationStatusPolicyId: string | null;
  expirationNotificationPolicyId: string | null;
  provider: {
    sentToProvider: boolean;
    providerName: string | null;
    sentToProviderAt: string | null;
    providerLeadTime: InternalAssetMaintenanceInterval | null;
    providerNotes: string | null;
  } | null;
  providerFollowUp: {
    enabled: boolean;
    rules: Array<{
      offset: InternalAssetMaintenanceInterval;
      recipientGroupIds: string[];
      ccRecipientGroupIds: string[];
    }>;
  } | null;
}

export type CreateInternalAssetMaintenanceRecordPayload =
  InternalAssetMaintenanceRecordMutationPayload;

export interface UpdateInternalAssetMaintenanceRecordPayload
  extends InternalAssetMaintenanceRecordMutationPayload {
  internalAssetMaintenanceRecordId: string;
}

export interface DeleteInternalAssetMaintenanceRecordPayload {
  internalAssetMaintenanceRecordId: string;
}

export interface SendProviderFollowUpPayload {
  internalAssetMaintenanceRecordId: string;
}

export interface InternalAssetControlState {
  list: {
    items: InternalAssetMaintenanceRecordListItem[];
    status: RequestStatus;
    error: string | null;
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    search: string;
    filters: InternalAssetMaintenanceRecordsListFilters;
    sorts: InternalAssetMaintenanceRecordsListSort[];
  };
  detail: {
    item: InternalAssetMaintenanceRecordDetail | null;
    status: RequestStatus;
    error: string | null;
    currentRecordId: string | null;
  };
  catalogs: {
    item: InternalAssetMaintenanceCatalog | null;
    status: RequestStatus;
    error: string | null;
  };
  mutations: {
    createStatus: RequestStatus;
    updateStatus: RequestStatus;
    deleteStatus: RequestStatus;
    providerFollowUpStatus: RequestStatus;
    error: string | null;
    message: string | null;
    currentRecordId: string | null;
    lastCreatedRecordId: string | null;
  };
}
