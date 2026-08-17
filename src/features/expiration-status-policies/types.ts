export type ExpirationStatusPolicyStatusId = 'ACTIVE' | 'DELETED';
export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
export type SortDirection = 'asc' | 'desc';
export type ExpirationStatusPolicySortField = 'name' | 'status' | 'created_at';

export interface ExpirationStatusPolicyActorSummary {
  userId: string;
  name: string | null;
  email: string | null;
}

export interface ExpirationStatusPolicyOffset {
  years: number;
  months: number;
  weeks: number;
  days: number;
}

export interface ExpirationStatusPolicyRule {
  ruleId: string;
  startOffset: ExpirationStatusPolicyOffset;
  label: string;
  colorHex: string;
}

export interface ExpirationStatusPolicyListItem {
  expirationStatusPolicyId: string;
  name: string;
  code: string;
  description: string | null;
  statusId: ExpirationStatusPolicyStatusId;
  statusName: string;
  rulesCount: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ExpirationStatusPolicyDetail extends ExpirationStatusPolicyListItem {
  rules: ExpirationStatusPolicyRule[];
  createdBy: ExpirationStatusPolicyActorSummary | null;
  updatedBy: ExpirationStatusPolicyActorSummary | null;
}

export interface ExpirationStatusPolicyOption {
  expirationStatusPolicyId: string;
  name: string;
  code: string;
  statusId: ExpirationStatusPolicyStatusId;
  statusName: string;
}

export interface ExpirationStatusPolicyStatusCatalogItem {
  code: ExpirationStatusPolicyStatusId;
  name: string;
  nameKey: string;
}

export interface ExpirationStatusPolicyCatalog {
  statuses: ExpirationStatusPolicyStatusCatalogItem[];
}

export interface ExpirationStatusPolicyListFilters {
  status: ExpirationStatusPolicyStatusId | null;
}

export interface ExpirationStatusPolicyListSort {
  field: ExpirationStatusPolicySortField;
  direction: SortDirection;
}

export interface FetchExpirationStatusPoliciesParams {
  page?: number;
  limit?: number;
  itemsPerPage?: number;
  search?: string | null;
  filters?: Partial<ExpirationStatusPolicyListFilters>;
  sorts?: ExpirationStatusPolicyListSort[];
}

export interface FetchExpirationStatusPoliciesResult {
  items: ExpirationStatusPolicyListItem[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface FetchExpirationStatusPolicyOptionsParams {
  search?: string | null;
  status?: ExpirationStatusPolicyStatusId | null;
}

export interface ExpirationStatusPolicyMutationPayload {
  name: string;
  description: string | null;
  statusId: ExpirationStatusPolicyStatusId;
  rules: Array<{
    ruleId?: string;
    startOffset: ExpirationStatusPolicyOffset;
    label: string;
    colorHex: string;
  }>;
}

export type CreateExpirationStatusPolicyPayload = ExpirationStatusPolicyMutationPayload;

export interface UpdateExpirationStatusPolicyPayload extends ExpirationStatusPolicyMutationPayload {
  expirationStatusPolicyId: string;
}

export interface DeleteExpirationStatusPolicyPayload {
  expirationStatusPolicyId: string;
}

export interface ExpirationStatusPoliciesState {
  list: {
    items: ExpirationStatusPolicyListItem[];
    status: RequestStatus;
    error: string | null;
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    search: string;
    filters: ExpirationStatusPolicyListFilters;
    sorts: ExpirationStatusPolicyListSort[];
  };
  detail: {
    item: ExpirationStatusPolicyDetail | null;
    status: RequestStatus;
    error: string | null;
    currentExpirationStatusPolicyId: string | null;
  };
  catalogs: {
    statuses: ExpirationStatusPolicyStatusCatalogItem[];
    options: ExpirationStatusPolicyOption[];
    status: RequestStatus;
    error: string | null;
  };
  mutations: {
    createStatus: RequestStatus;
    updateStatus: RequestStatus;
    deleteStatus: RequestStatus;
    error: string | null;
    lastCreatedExpirationStatusPolicyId: string | null;
    currentExpirationStatusPolicyId: string | null;
    message: string | null;
  };
}
