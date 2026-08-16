export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
export type SortDirection = 'asc' | 'desc';
export type RecipientGroupStatusId = 'ACTIVE' | 'DELETED';
export type RecipientGroupSortField = 'name' | 'status' | 'created_at';

export interface CommunicationChannel {
  code: string;
  name: string;
  nameKey: string;
}

export interface RecipientGroupActorSummary {
  userId: string;
  name: string | null;
  email: string | null;
}

export interface RecipientGroupContactSummary {
  contactId: string;
  type: 'INTERNAL' | 'EXTERNAL';
  userId: string | null;
  fullName: string;
  companyName: string | null;
  primaryEmail: string | null;
  primaryCellPhone: string | null;
  statusId: 'ACTIVE' | 'DELETED';
  statusName: string;
}

export interface RecipientGroupListItem {
  recipientGroupId: string;
  name: string;
  code: string;
  description: string | null;
  enabledChannels: CommunicationChannel[];
  contactsCount: number;
  statusId: RecipientGroupStatusId;
  statusName: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface RecipientGroupDetail extends RecipientGroupListItem {
  contacts: RecipientGroupContactSummary[];
  createdBy: RecipientGroupActorSummary | null;
  updatedBy: RecipientGroupActorSummary | null;
}

export interface RecipientGroupListFilters {
  status: RecipientGroupStatusId | null;
}

export interface RecipientGroupListSort {
  field: RecipientGroupSortField;
  direction: SortDirection;
}

export interface FetchRecipientGroupsParams {
  page?: number;
  limit?: number;
  itemsPerPage?: number;
  search?: string | null;
  filters?: Partial<RecipientGroupListFilters>;
  sorts?: RecipientGroupListSort[];
}

export interface FetchRecipientGroupsResult {
  items: RecipientGroupListItem[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface RecipientGroupMutationPayload {
  name: string;
  description: string | null;
  enabledChannels: string[];
  contactIds: string[];
}

export type CreateRecipientGroupPayload = RecipientGroupMutationPayload;

export interface UpdateRecipientGroupPayload extends RecipientGroupMutationPayload {
  recipientGroupId: string;
}

export interface DeleteRecipientGroupPayload {
  recipientGroupId: string;
}

export interface RecipientGroupsState {
  list: {
    items: RecipientGroupListItem[];
    status: RequestStatus;
    error: string | null;
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    search: string;
    filters: RecipientGroupListFilters;
    sorts: RecipientGroupListSort[];
  };
  detail: {
    item: RecipientGroupDetail | null;
    status: RequestStatus;
    error: string | null;
    currentRecipientGroupId: string | null;
  };
  catalogs: {
    communicationChannels: CommunicationChannel[];
    status: RequestStatus;
    error: string | null;
  };
  mutations: {
    createStatus: RequestStatus;
    updateStatus: RequestStatus;
    deleteStatus: RequestStatus;
    error: string | null;
    lastCreatedRecipientGroupId: string | null;
    currentRecipientGroupId: string | null;
    message: string | null;
  };
}
