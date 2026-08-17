export type ExpirationNotificationPolicyStatusId = 'ACTIVE' | 'INACTIVE' | 'DELETED';
export type ExpirationNotificationPolicyAnchorCode = 'BEFORE_EXPIRATION' | 'AFTER_EXPIRATION';
export type ExpirationNotificationPolicyTriggerModeCode = 'ONE_TIME' | 'RECURRING';
export type ExpirationNotificationPolicyRepeatUntilCode =
  | 'EXPIRATION_DATE'
  | 'STATUS_CHANGES'
  | 'FIXED_DURATION';
export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
export type SortDirection = 'asc' | 'desc';
export type ExpirationNotificationPolicySortField = 'name' | 'status' | 'created_at';

export interface ExpirationNotificationPolicyActorSummary {
  userId: string;
  name: string | null;
  email: string | null;
}

export interface ExpirationNotificationPolicyOffset {
  years: number;
  months: number;
  weeks: number;
  days: number;
}

export interface ExpirationNotificationPolicyCatalogItem<TCode extends string = string> {
  code: TCode;
  name: string;
  nameKey: string;
}

export interface ExpirationNotificationPolicyChannelSummary {
  code: string;
  name: string;
  nameKey: string | null;
}

export interface ExpirationNotificationPolicyRecipientGroupSummary {
  recipientGroupId: string;
  name: string;
  code: string;
  statusId: string;
  statusName: string;
  enabledChannels: ExpirationNotificationPolicyChannelSummary[];
}

export interface ExpirationNotificationPolicyRule {
  ruleId: string;
  anchor: ExpirationNotificationPolicyCatalogItem<ExpirationNotificationPolicyAnchorCode>;
  startOffset: ExpirationNotificationPolicyOffset;
  triggerMode: ExpirationNotificationPolicyCatalogItem<ExpirationNotificationPolicyTriggerModeCode>;
  recipientGroupIds: string[];
  repeatEvery: ExpirationNotificationPolicyOffset | null;
  repeatUntil: ExpirationNotificationPolicyCatalogItem<ExpirationNotificationPolicyRepeatUntilCode> | null;
  repeatFor: ExpirationNotificationPolicyOffset | null;
  recipientGroups: ExpirationNotificationPolicyRecipientGroupSummary[];
}

export interface ExpirationNotificationPolicyListItem {
  expirationNotificationPolicyId: string;
  name: string;
  code: string;
  statusId: ExpirationNotificationPolicyStatusId;
  statusName: string;
  rulesCount: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ExpirationNotificationPolicyDetail extends ExpirationNotificationPolicyListItem {
  description: string | null;
  rules: ExpirationNotificationPolicyRule[];
  createdBy: ExpirationNotificationPolicyActorSummary | null;
  updatedBy: ExpirationNotificationPolicyActorSummary | null;
}

export interface ExpirationNotificationPolicyOption {
  expirationNotificationPolicyId: string;
  name: string;
  code: string;
  statusId: ExpirationNotificationPolicyStatusId;
  statusName: string;
}

export interface ExpirationNotificationPolicyCatalog {
  statuses: ExpirationNotificationPolicyCatalogItem<ExpirationNotificationPolicyStatusId>[];
  anchors: ExpirationNotificationPolicyCatalogItem<ExpirationNotificationPolicyAnchorCode>[];
  triggerModes: ExpirationNotificationPolicyCatalogItem<ExpirationNotificationPolicyTriggerModeCode>[];
  repeatUntilValues: ExpirationNotificationPolicyCatalogItem<ExpirationNotificationPolicyRepeatUntilCode>[];
}

export interface ExpirationNotificationPolicyListFilters {
  status: ExpirationNotificationPolicyStatusId | null;
}

export interface ExpirationNotificationPolicyListSort {
  field: ExpirationNotificationPolicySortField;
  direction: SortDirection;
}

export interface FetchExpirationNotificationPoliciesParams {
  page?: number;
  limit?: number;
  itemsPerPage?: number;
  search?: string | null;
  filters?: Partial<ExpirationNotificationPolicyListFilters>;
  sorts?: ExpirationNotificationPolicyListSort[];
}

export interface FetchExpirationNotificationPoliciesResult {
  items: ExpirationNotificationPolicyListItem[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface FetchExpirationNotificationPolicyOptionsParams {
  search?: string | null;
  status?: ExpirationNotificationPolicyStatusId | null;
}

export interface ExpirationNotificationPolicyMutationRulePayload {
  ruleId?: string;
  anchor: ExpirationNotificationPolicyAnchorCode;
  startOffset: ExpirationNotificationPolicyOffset;
  triggerMode: ExpirationNotificationPolicyTriggerModeCode;
  recipientGroupIds: string[];
  repeatEvery: ExpirationNotificationPolicyOffset | null;
  repeatUntil: ExpirationNotificationPolicyRepeatUntilCode | null;
  repeatFor: ExpirationNotificationPolicyOffset | null;
}

export interface ExpirationNotificationPolicyMutationPayload {
  name: string;
  description: string | null;
  statusId: ExpirationNotificationPolicyStatusId;
  rules: ExpirationNotificationPolicyMutationRulePayload[];
}

export type CreateExpirationNotificationPolicyPayload = ExpirationNotificationPolicyMutationPayload;

export interface UpdateExpirationNotificationPolicyPayload
  extends ExpirationNotificationPolicyMutationPayload {
  expirationNotificationPolicyId: string;
}

export interface DeleteExpirationNotificationPolicyPayload {
  expirationNotificationPolicyId: string;
}

export interface ExpirationNotificationPoliciesState {
  list: {
    items: ExpirationNotificationPolicyListItem[];
    status: RequestStatus;
    error: string | null;
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    search: string;
    filters: ExpirationNotificationPolicyListFilters;
    sorts: ExpirationNotificationPolicyListSort[];
  };
  detail: {
    item: ExpirationNotificationPolicyDetail | null;
    status: RequestStatus;
    error: string | null;
    currentExpirationNotificationPolicyId: string | null;
  };
  catalogs: {
    statuses: ExpirationNotificationPolicyCatalog['statuses'];
    anchors: ExpirationNotificationPolicyCatalog['anchors'];
    triggerModes: ExpirationNotificationPolicyCatalog['triggerModes'];
    repeatUntilValues: ExpirationNotificationPolicyCatalog['repeatUntilValues'];
    options: ExpirationNotificationPolicyOption[];
    status: RequestStatus;
    error: string | null;
  };
  mutations: {
    createStatus: RequestStatus;
    updateStatus: RequestStatus;
    deleteStatus: RequestStatus;
    error: string | null;
    lastCreatedExpirationNotificationPolicyId: string | null;
    currentExpirationNotificationPolicyId: string | null;
    message: string | null;
  };
}
